import mongoose, { Document, Schema } from 'mongoose';

export interface Category extends Document {
  name: string;
  slug: string;
  parentId?: mongoose.Types.ObjectId;
  path?: string; // Ejemplo: "Perros / Alimentos / Adultos"
  isActive: boolean;
}

const CategorySchema = new Schema<Category>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true },
    parentId: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
    path: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Índice para búsquedas rápidas por jerarquía
CategorySchema.index({ parentId: 1 });
CategorySchema.index({ slug: 1, parentId: 1 }, { unique: true });

export const CategoryModel = mongoose.model<Category>('Category', CategorySchema);
