import mongoose, { Document, Schema } from 'mongoose';
import { Sale, SaleItem } from '../domain/sale.entity';

export interface SaleDocument extends Omit<Sale, '_id'>, Document {}

const SaleItemSchema = new Schema<SaleItem>(
  {
    type: { type: String, enum: ['PRODUCT', 'SERVICE'], required: true },
    referenceId: { type: Schema.Types.ObjectId as any, required: true },
    nameSnapshot: { type: String, required: true },
    unitPrice: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    lineSubtotal: { type: Number, required: true, min: 0 },
    discountPercent: { type: Number, min: 0, max: 100, default: 0 },
    discountAmount: { type: Number, min: 0, default: 0 },
    lineTotal: { type: Number, required: true, min: 0 },
    costSnapshot: { type: Number, min: 0 },
    profitSnapshot: { type: Number },
  },
  { _id: false }
);

const SaleSchema = new Schema<SaleDocument>(
  {
    items: { type: [SaleItemSchema], required: true },
    subtotal: { type: Number, required: true, min: 0 },
    lineDiscountTotal: { type: Number, min: 0, default: 0 },
    cartDiscountPercent: { type: Number, min: 0, max: 100, default: 0 },
    cartDiscountAmount: { type: Number, min: 0, default: 0 },
    total: { type: Number, required: true, min: 0 },
    paymentMethodId: {
      type: Schema.Types.ObjectId as any,
      required: true,
      ref: 'PaymentMethod',
    },
    paymentMethodNameSnapshot: { type: String, required: true },
    customerAlias: { type: String, trim: true },
    notes: { type: String },
  },
  {
    timestamps: true,
    collection: 'sales',
  }
);

SaleSchema.index({ createdAt: -1 });
SaleSchema.index({ paymentMethodId: 1, createdAt: -1 });
SaleSchema.index({ customerAlias: 1, createdAt: -1 });

export const SaleModel = mongoose.model<SaleDocument>('Sale', SaleSchema);
