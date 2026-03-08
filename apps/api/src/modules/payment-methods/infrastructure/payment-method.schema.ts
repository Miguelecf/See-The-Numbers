import mongoose, { Document, Schema } from 'mongoose';
import { PaymentMethod } from '../domain/payment-method.entity';

export interface PaymentMethodDocument extends Omit<PaymentMethod, '_id'>, Document {}

const PaymentMethodSchema = new Schema<PaymentMethodDocument>(
  {
    name: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    collection: 'payment_methods',
  }
);

PaymentMethodSchema.index({ name: 1 }, { unique: true });
PaymentMethodSchema.index({ isActive: 1, sortOrder: 1 });

export const PaymentMethodModel = mongoose.model<PaymentMethodDocument>(
  'PaymentMethod',
  PaymentMethodSchema
);
