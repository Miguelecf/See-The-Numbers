import { BadRequestError, NotFoundError } from '../../../shared/errors/app-error';
import { ProductRepository } from '../../products/infrastructure/product.repository';
import { ServiceRepository } from '../../services/infrastructure/service.repository';
import { enrichServiceWithCalculations } from '../../services/domain/service.calculations';
import { PaymentMethodRepository } from '../../payment-methods/infrastructure/payment-method.repository';
import { StockMovementRepository } from '../../inventory/infrastructure/stock-movement.repository';
import { CreateSaleInput, SaleItem } from '../domain/sale.entity';
import { SaleRepository } from '../infrastructure/sale.repository';

export const createSaleUseCase = async (
  saleRepository: SaleRepository,
  productRepository: ProductRepository,
  serviceRepository: ServiceRepository,
  paymentMethodRepository: PaymentMethodRepository,
  stockMovementRepository: StockMovementRepository,
  input: CreateSaleInput
) => {
  if (input.items.length === 0) {
    throw new BadRequestError('Sale must have at least one item');
  }

  const cartDiscountPercent = input.cartDiscountPercent ?? 0;
  if (cartDiscountPercent < 0 || cartDiscountPercent > 100) {
    throw new BadRequestError('Cart discount percent must be between 0 and 100');
  }

  const hasItemDiscount = input.items.some((item) => (item.discountPercent ?? 0) > 0);
  const hasCartDiscount = cartDiscountPercent > 0;
  if (hasItemDiscount && hasCartDiscount) {
    throw new BadRequestError('Use either item discount or cart discount, not both in the same sale');
  }

  const paymentMethod = await paymentMethodRepository.findById(input.paymentMethodId);
  if (!paymentMethod.isActive) {
    throw new BadRequestError('Payment method is inactive');
  }

  const productIds = [...new Set(input.items.filter((i) => i.type === 'PRODUCT').map((i) => i.referenceId))];
  const serviceIds = [...new Set(input.items.filter((i) => i.type === 'SERVICE').map((i) => i.referenceId))];

  const [products, services] = await Promise.all([
    productRepository.findByIds(productIds),
    serviceRepository.findByIds(serviceIds),
  ]);

  const productsById = new Map(products.map((p) => [p._id!, p]));
  const servicesById = new Map(services.map((s) => [s._id!, s]));
  const saleItems: SaleItem[] = [];
  const productQuantityChanges = new Map<string, { before: number; after: number }>();

  for (const item of input.items) {
    if (item.quantity <= 0) {
      throw new BadRequestError('Item quantity must be greater than 0');
    }

    const itemDiscountPercent = item.discountPercent ?? 0;
    if (itemDiscountPercent < 0 || itemDiscountPercent > 100) {
      throw new BadRequestError('Item discount percent must be between 0 and 100');
    }

    if (item.type === 'PRODUCT') {
      const product = productsById.get(item.referenceId);
      if (!product) {
        throw new NotFoundError(`Product not found: ${item.referenceId}`);
      }

      if (!product.isActive) {
        throw new BadRequestError(`Product is inactive: ${product.name}`);
      }

      const alreadyReserved = productQuantityChanges.get(product._id!)?.before ?? product.quantity;
      const alreadyAfter = productQuantityChanges.get(product._id!)?.after ?? product.quantity;
      const nextAfter = alreadyAfter - item.quantity;

      if (nextAfter < 0) {
        throw new BadRequestError(`Insufficient stock for product: ${product.name}`);
      }

      productQuantityChanges.set(product._id!, {
        before: alreadyReserved,
        after: nextAfter,
      });

      const lineSubtotal = product.price * item.quantity;
      const discountAmount = lineSubtotal * (itemDiscountPercent / 100);
      const lineTotal = lineSubtotal - discountAmount;
      const lineProfit = (product.price - product.cost) * item.quantity - discountAmount;

      saleItems.push({
        type: 'PRODUCT',
        referenceId: product._id!,
        nameSnapshot: product.name,
        unitPrice: product.price,
        quantity: item.quantity,
        lineSubtotal,
        discountPercent: itemDiscountPercent,
        discountAmount,
        lineTotal,
        costSnapshot: product.cost,
        profitSnapshot: lineProfit,
      });
      continue;
    }

    const service = servicesById.get(item.referenceId);
    if (!service) {
      throw new NotFoundError(`Service not found: ${item.referenceId}`);
    }

    if (!service.isActive) {
      throw new BadRequestError(`Service is inactive: ${service.name}`);
    }

    const serviceWithCalcs = enrichServiceWithCalculations(service);
    const lineSubtotal = service.salePrice * item.quantity;
    const discountAmount = lineSubtotal * (itemDiscountPercent / 100);
    const lineTotal = lineSubtotal - discountAmount;
    const lineProfit = (service.salePrice - serviceWithCalcs.costTotal) * item.quantity - discountAmount;

    saleItems.push({
      type: 'SERVICE',
      referenceId: service._id!,
      nameSnapshot: service.name,
      unitPrice: service.salePrice,
      quantity: item.quantity,
      lineSubtotal,
      discountPercent: itemDiscountPercent,
      discountAmount,
      lineTotal,
      costSnapshot: serviceWithCalcs.costTotal,
      profitSnapshot: lineProfit,
    });
  }

  const subtotal = saleItems.reduce((sum, item) => sum + item.lineSubtotal, 0);
  const lineDiscountTotal = saleItems.reduce((sum, item) => sum + (item.discountAmount ?? 0), 0);
  const subtotalAfterLineDiscount = subtotal - lineDiscountTotal;
  const cartDiscountAmount = subtotalAfterLineDiscount * (cartDiscountPercent / 100);
  const total = subtotalAfterLineDiscount - cartDiscountAmount;

  const appliedChanges: Array<{ productId: string; previousQuantity: number }> = [];

  try {
    for (const [productId, change] of productQuantityChanges.entries()) {
      await productRepository.setQuantity(productId, change.after);
      appliedChanges.push({ productId, previousQuantity: change.before });
    }

    const sale = await saleRepository.create({
      items: saleItems,
      subtotal,
      lineDiscountTotal,
      cartDiscountPercent,
      cartDiscountAmount,
      total,
      paymentMethodId: paymentMethod._id!,
      paymentMethodNameSnapshot: paymentMethod.name,
      customerAlias: input.customerAlias?.trim() || undefined,
      notes: input.notes,
    });

    for (const item of saleItems) {
      if (item.type !== 'PRODUCT') continue;

      await stockMovementRepository.create({
        productId: item.referenceId,
        type: 'OUT',
        quantity: item.quantity,
        reason: 'Sale confirmed',
        referenceType: 'SALE',
        referenceId: sale._id,
      });
    }

    return sale;
  } catch (error) {
    await Promise.all(
      appliedChanges.map((change) => productRepository.setQuantity(change.productId, change.previousQuantity))
    );
    throw error;
  }
};
