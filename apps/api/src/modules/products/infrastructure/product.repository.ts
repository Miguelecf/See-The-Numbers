import { ClientSession, FilterQuery } from 'mongoose';
import { Product, ProductFilters } from '../domain/product.entity';
import { ProductModel } from './product.schema';
import { NotFoundError } from '../../../shared/errors/app-error';

export class ProductRepository {
  async findAll(filters: ProductFilters = {}): Promise<Product[]> {
    const query: FilterQuery<any> = {};

    if (filters.category) query.category = filters.category;
    if (filters.supplier) query.supplier = filters.supplier;
    if (filters.laboratory) query.laboratory = filters.laboratory;
    if (filters.isActive !== undefined) query.isActive = filters.isActive;

    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { sku: { $regex: filters.search, $options: 'i' } },
        { barcode: { $regex: filters.search, $options: 'i' } },
      ];
    }

    const docs = await ProductModel.find(query).lean();
    return docs.map((doc) => this.toEntity(doc));
  }

  async findById(id: string, session?: ClientSession): Promise<Product> {
    const doc = await ProductModel.findById(id).session(session ?? null).lean();
    if (!doc) {
      throw new NotFoundError('Product not found');
    }
    return this.toEntity(doc);
  }

  async findByIds(ids: string[], session?: ClientSession): Promise<Product[]> {
    const docs = await ProductModel.find({ _id: { $in: ids } })
      .session(session ?? null)
      .lean();
    return docs.map((doc) => this.toEntity(doc));
  }

  async findBySku(sku: string): Promise<Product | null> {
    const doc = await ProductModel.findOne({ sku }).lean();
    if (!doc) return null;
    return this.toEntity(doc);
  }

  async findBySkus(skus: string[]): Promise<Product[]> {
    const docs = await ProductModel.find({ sku: { $in: skus } }).lean();
    return docs.map((doc) => this.toEntity(doc));
  }

  async create(data: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const doc = await ProductModel.create(data);
    return this.toEntity(doc.toObject());
  }

  async update(id: string, data: Partial<Product>): Promise<Product> {
    const doc = await ProductModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();

    if (!doc) {
      throw new NotFoundError('Product not found');
    }

    return this.toEntity(doc);
  }

  async setQuantity(id: string, quantity: number, session?: ClientSession): Promise<Product> {
    const doc = await ProductModel.findByIdAndUpdate(
      id,
      { quantity },
      { new: true, runValidators: true, session }
    ).lean();

    if (!doc) {
      throw new NotFoundError('Product not found');
    }

    return this.toEntity(doc);
  }

  async incrementQuantity(id: string, quantityDelta: number, session?: ClientSession): Promise<Product> {
    const doc = await ProductModel.findByIdAndUpdate(
      id,
      { $inc: { quantity: quantityDelta } },
      { new: true, runValidators: true, session }
    ).lean();

    if (!doc) {
      throw new NotFoundError('Product not found');
    }

    return this.toEntity(doc);
  }

  async toggleActive(id: string): Promise<Product> {
    const existing = await ProductModel.findById(id);
    if (!existing) {
      throw new NotFoundError('Product not found');
    }

    const nextIsActive = !existing.isActive;
    existing.isActive = nextIsActive;
    existing.deletedAt = nextIsActive ? null : new Date();
    await existing.save();

    return this.toEntity(existing.toObject());
  }

  private toEntity(doc: any): Product {
    return {
      _id: doc._id.toString(),
      barcode: doc.barcode,
      sku: doc.sku,
      name: doc.name,
      supplier: doc.supplier,
      unitOfMeasure: doc.unitOfMeasure,
      cost: doc.cost,
      quantity: doc.quantity,
      price: doc.price,
      category: doc.category,
      laboratory: doc.laboratory,
      stockMinimum: doc.stockMinimum,
      notes: doc.notes,
      isActive: doc.isActive,
      deletedAt: doc.deletedAt,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
