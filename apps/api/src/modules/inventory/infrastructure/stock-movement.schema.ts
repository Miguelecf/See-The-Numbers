import mongoose, { Document, Schema } from 'mongoose';
import { StockMovement } from '../domain/stock-movement.entity';

export interface StockMovementDocument extends Omit<StockMovement, '_id'>, Document {}

const StockMovementSchema = new Schema<StockMovementDocument>(
  {
    productId: { type: Schema.Types.ObjectId as any, ref: 'Product', required: true },
    type: { type: String, enum: ['IN', 'OUT', 'ADJUSTMENT'], required: true },
    quantity: { type: Number, required: true, min: 1 },
    reason: { type: String, required: true, trim: true },
    notes: { type: String },
    referenceType: { type: String, enum: ['SALE', 'MANUAL'] },
    referenceId: { type: Schema.Types.ObjectId as any },
  },
  {
    timestamps: true,
    collection: 'stock_movements',
  }
);

StockMovementSchema.index({ productId: 1, createdAt: -1 });
StockMovementSchema.index({ type: 1, createdAt: -1 });

export const StockMovementModel = mongoose.model<StockMovementDocument>(
  'StockMovement',
  StockMovementSchema
);
