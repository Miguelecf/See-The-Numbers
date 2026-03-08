import mongoose, { Schema, Document } from 'mongoose';
import { Product } from '../domain/product.entity';

export interface ProductDocument extends Omit<Product, '_id'>, Document {}

const ProductSchema = new Schema<ProductDocument>(
  {
    barcode: { type: String, trim: true },
    sku: { type: String, trim: true, default: null },
    name: { type: String, required: true, trim: true },
    supplier: { type: String, required: true, trim: true },
    unitOfMeasure: { type: String, required: true, trim: true },
    cost: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 0, default: 0 },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, trim: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
    laboratory: { type: String, required: true, trim: true },
    stockMinimum: { type: Number, min: 0 },
    notes: { type: String },
    isActive: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    collection: 'products',
  }
);

// Índices
ProductSchema.index({ name: 1 });
ProductSchema.index({ isActive: 1 });
ProductSchema.index({ sku: 1 }, { unique: true, sparse: true });
ProductSchema.index({ barcode: 1 }, { unique: true, sparse: true });
ProductSchema.index({ category: 1 });
ProductSchema.index({ supplier: 1 });
ProductSchema.index({ laboratory: 1 });

export const ProductModel = mongoose.model<ProductDocument>('Product', ProductSchema);
