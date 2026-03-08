import mongoose, { Schema, Document } from 'mongoose';
import { Service } from '../domain/service.entity';
import { CostItem } from '../domain/cost-item.entity';

export interface ServiceDocument extends Omit<Service, '_id'>, Document {}

const CostItemSchema = new Schema<CostItem>(
  {
    name: { type: String, required: true },
    category: { type: String },
    amount: { type: Number, required: true, min: 0 },
    notes: { type: String },
  },
  { _id: true }
);

const ServiceSchema = new Schema<ServiceDocument>(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, trim: true },
    salePrice: { type: Number, required: true, min: 0 },
    estimatedDurationMinutes: { type: Number, required: true, min: 1 },
    laborCost: { type: Number, required: true, min: 0, default: 0 },
    costItems: { type: [CostItemSchema], default: [] },
    notes: { type: String },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    collection: 'services',
  }
);

// Índices
ServiceSchema.index({ name: 1 });
ServiceSchema.index({ isActive: 1 });

export const ServiceModel = mongoose.model<ServiceDocument>('Service', ServiceSchema);
