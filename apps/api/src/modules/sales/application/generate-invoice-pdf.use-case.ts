import PDFDocument from 'pdfkit';
import { SaleRepository } from '../infrastructure/sale.repository';
import { Sale } from '../domain/sale.entity';

export const generateInvoicePdfUseCase = async (
  saleRepository: SaleRepository,
  saleId: string,
  storeName: string = 'SeeTheNumbers'
): Promise<PDFKit.PDFDocument> => {
  const sale = await saleRepository.findById(saleId);
  if (!sale) {
    throw new Error('Venta no encontrada');
  }

  const doc = new PDFDocument({
    size: 'A4',
    margin: 50,
  });

  // --- Header ---
  doc
    .fillColor('#444444')
    .fontSize(20)
    .text(storeName, 50, 50)
    .fontSize(10)
    .text('Comprobante de Venta Interno', 50, 75)
    .fillColor('#000000')
    .fontSize(20)
    .text('COMPROBANTE DE VENTA', 200, 50, { align: 'right' })
    .fontSize(10)
    .text(`Venta #: ${sale._id}`, 200, 80, { align: 'right' })
    .text(`Fecha: ${new Date(sale.createdAt!).toLocaleDateString('es-AR')}`, 200, 95, { align: 'right' })
    .moveDown();

  // --- Customer Info ---
  doc
    .fillColor('#000000')
    .fontSize(14)
    .text('Información del Cliente', 50, 150);

  doc
    .fontSize(10)
    .text(`Cliente: ${sale.customerAlias || 'Consumidor Final'}`, 50, 170)
    .text(`Método de Pago: ${sale.paymentMethodNameSnapshot}`, 50, 185)
    .moveDown();

  // --- Table Header ---
  const tableTop = 230;
  doc
    .fontSize(10)
    .font('Helvetica-Bold')
    .text('Ítem', 50, tableTop)
    .text('Cant.', 250, tableTop, { width: 50, align: 'right' })
    .text('Precio Unit.', 300, tableTop, { width: 100, align: 'right' })
    .text('Dcto %', 400, tableTop, { width: 50, align: 'right' })
    .text('Total', 450, tableTop, { width: 100, align: 'right' });

  doc
    .moveTo(50, tableTop + 15)
    .lineTo(550, tableTop + 15)
    .stroke();

  // --- Table Rows ---
  let position = tableTop + 25;
  doc.font('Helvetica');

  sale.items.forEach((item) => {
    doc
      .text(item.nameSnapshot, 50, position, { width: 200 })
      .text(item.quantity.toString(), 250, position, { width: 50, align: 'right' })
      .text(`$${item.unitPrice.toLocaleString('es-AR')}`, 300, position, { width: 100, align: 'right' })
      .text(`${item.discountPercent ?? 0}%`, 400, position, { width: 50, align: 'right' })
      .text(`$${item.lineTotal.toLocaleString('es-AR')}`, 450, position, { width: 100, align: 'right' });

    position += 20;
  });

  // --- Totals ---
  const totalsTop = position + 30;
  doc
    .moveTo(350, totalsTop)
    .lineTo(550, totalsTop)
    .stroke();

  doc
    .fontSize(10)
    .text('Subtotal:', 350, totalsTop + 10)
    .text(`$${sale.subtotal.toLocaleString('es-AR')}`, 450, totalsTop + 10, { width: 100, align: 'right' })
    .text('Descuento total:', 350, totalsTop + 25)
    .text(`-$${((sale.lineDiscountTotal || 0) + (sale.cartDiscountAmount || 0)).toLocaleString('es-AR')}`, 450, totalsTop + 25, { width: 100, align: 'right' })
    .fontSize(12)
    .font('Helvetica-Bold')
    .text('TOTAL:', 350, totalsTop + 45)
    .text(`$${sale.total.toLocaleString('es-AR')}`, 450, totalsTop + 45, { width: 100, align: 'right' });

  // --- Footer ---
  doc
    .fontSize(10)
    .font('Helvetica')
    .text('¡Gracias por su compra!', 50, 700, { align: 'center', width: 500 });

  doc.end();

  return doc;
};
