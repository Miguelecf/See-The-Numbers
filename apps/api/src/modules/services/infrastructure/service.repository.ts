import { ClientSession } from 'mongoose';
import { Service } from '../domain/service.entity';
import { ServiceModel } from './service.schema';
import { NotFoundError } from '../../../shared/errors/app-error';

export class ServiceRepository {
  async findAll(): Promise<Service[]> {
    const docs = await ServiceModel.find().lean();
    return docs.map((doc) => this.toEntity(doc));
  }

  async findById(id: string, session?: ClientSession): Promise<Service> {
    const doc = await ServiceModel.findById(id).session(session ?? null).lean();
    if (!doc) {
      throw new NotFoundError('Service not found');
    }
    return this.toEntity(doc);
  }

  async findByIds(ids: string[], session?: ClientSession): Promise<Service[]> {
    const docs = await ServiceModel.find({ _id: { $in: ids } })
      .session(session ?? null)
      .lean();
    return docs.map((doc) => this.toEntity(doc));
  }

  async create(data: Omit<Service, '_id' | 'createdAt' | 'updatedAt'>): Promise<Service> {
    const doc = await ServiceModel.create(data);
    return this.toEntity(doc.toObject());
  }

  async update(id: string, data: Partial<Service>): Promise<Service> {
    const doc = await ServiceModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();

    if (!doc) {
      throw new NotFoundError('Service not found');
    }

    return this.toEntity(doc);
  }

  async toggleActive(id: string): Promise<Service> {
    const existing = await ServiceModel.findById(id);
    if (!existing) {
      throw new NotFoundError('Service not found');
    }

    existing.isActive = !existing.isActive;
    await existing.save();

    return this.toEntity(existing.toObject());
  }

  private toEntity(doc: any): Service {
    return {
      _id: doc._id.toString(),
      name: doc.name,
      category: doc.category,
      salePrice: doc.salePrice,
      estimatedDurationMinutes: doc.estimatedDurationMinutes,
      laborCost: doc.laborCost,
      costItems: doc.costItems.map((item: any) => ({
        _id: item._id?.toString(),
        name: item.name,
        category: item.category,
        amount: item.amount,
        notes: item.notes,
      })),
      notes: doc.notes,
      isActive: doc.isActive,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
