import { ClientSession } from 'mongoose';
import { Sale } from '../domain/sale.entity';
import { SaleModel } from './sale.schema';
import { NotFoundError } from '../../../shared/errors/app-error';

export class SaleRepository {
  async create(data: Omit<Sale, '_id' | 'createdAt' | 'updatedAt'>, session?: ClientSession): Promise<Sale> {
    const doc = await SaleModel.create([data], { session });
    return this.toEntity(doc[0].toObject());
  }

  async findAll(limit = 100, customerAliasSearch?: string): Promise<Sale[]> {
    const query = customerAliasSearch
      ? { customerAlias: { $regex: customerAliasSearch, $options: 'i' } }
      : {};

    const docs = await SaleModel.find(query).sort({ createdAt: -1 }).limit(limit).lean();
    return docs.map((doc) => this.toEntity(doc));
  }

  async findById(id: string): Promise<Sale> {
    const doc = await SaleModel.findById(id).lean();
    if (!doc) {
      throw new NotFoundError('Sale not found');
    }
    return this.toEntity(doc);
  }

  private toEntity(doc: any): Sale {
    return {
      _id: doc._id.toString(),
      items: doc.items.map((item: any) => ({
        type: item.type,
        referenceId: item.referenceId.toString(),
        nameSnapshot: item.nameSnapshot,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        lineSubtotal: item.lineSubtotal,
        discountPercent: item.discountPercent,
        discountAmount: item.discountAmount,
        lineTotal: item.lineTotal,
        costSnapshot: item.costSnapshot,
        profitSnapshot: item.profitSnapshot,
      })),
      subtotal: doc.subtotal,
      lineDiscountTotal: doc.lineDiscountTotal,
      cartDiscountPercent: doc.cartDiscountPercent,
      cartDiscountAmount: doc.cartDiscountAmount,
      total: doc.total,
      paymentMethodId: doc.paymentMethodId.toString(),
      paymentMethodNameSnapshot: doc.paymentMethodNameSnapshot,
      customerAlias: doc.customerAlias,
      notes: doc.notes,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
