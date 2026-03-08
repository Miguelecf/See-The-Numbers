import mongoose from 'mongoose';
import { Category } from '../domain/category.entity';
import { CategoryModel } from './category.schema';

export class CategoryRepository {
  async findAll(parentId: string | null = null): Promise<Category[]> {
    return CategoryModel.find({ parentId, isActive: true }).lean() as any;
  }

  async findById(id: string): Promise<Category | null> {
    return CategoryModel.findById(id).lean() as any;
  }

  async findByNameAndParent(name: string, parentId: string | null): Promise<Category | null> {
    return CategoryModel.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') }, parentId }).lean() as any;
  }

  async create(data: Partial<Category>): Promise<Category> {
    const category = new CategoryModel(data);
    await category.save();
    return category.toObject() as any;
  }

  /**
   * Procesa un string tipo "Perros/Alimentos/Adultos" y crea las categorías
   * faltantes en la jerarquía, devolviendo el ID de la categoría final.
   */
  async findOrCreateByPath(path: string): Promise<string> {
    const parts = path.split('/').map(p => p.trim()).filter(p => p.length > 0);
    let currentParentId: string | null = null;
    let currentPath = '';

    for (const part of parts) {
      const existing = await this.findByNameAndParent(part, currentParentId);
      
      if (existing) {
        currentParentId = existing._id!;
        currentPath = existing.path;
      } else {
        const slug = part.toLowerCase()
          .replace(/[^a-z0-9]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');
        
        currentPath = currentPath ? `${currentPath} / ${part}` : part;
        
        const created = await this.create({
          name: part,
          slug,
          parentId: currentParentId as any,
          path: currentPath,
          isActive: true
        });
        
        currentParentId = created._id!;
      }
    }

    if (!currentParentId) {
      throw new Error('No se pudo procesar la categoría');
    }

    return currentParentId;
  }
}
