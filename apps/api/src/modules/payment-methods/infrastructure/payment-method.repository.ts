import { NotFoundError } from '../../../shared/errors/app-error';
import { PaymentMethod } from '../domain/payment-method.entity';
import { PaymentMethodModel } from './payment-method.schema';

export class PaymentMethodRepository {
  async findAll(): Promise<PaymentMethod[]> {
    const docs = await PaymentMethodModel.find().sort({ sortOrder: 1, name: 1 }).lean();
    return docs.map((doc) => this.toEntity(doc));
  }

  async findById(id: string): Promise<PaymentMethod> {
    const doc = await PaymentMethodModel.findById(id).lean();
    if (!doc) {
      throw new NotFoundError('Payment method not found');
    }
    return this.toEntity(doc);
  }

  async create(data: Omit<PaymentMethod, '_id' | 'createdAt' | 'updatedAt'>): Promise<PaymentMethod> {
    const doc = await PaymentMethodModel.create(data);
    return this.toEntity(doc.toObject());
  }

  async update(id: string, data: Partial<PaymentMethod>): Promise<PaymentMethod> {
    const doc = await PaymentMethodModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();

    if (!doc) {
      throw new NotFoundError('Payment method not found');
    }

    return this.toEntity(doc);
  }

  async toggleActive(id: string): Promise<PaymentMethod> {
    const existing = await PaymentMethodModel.findById(id);
    if (!existing) {
      throw new NotFoundError('Payment method not found');
    }

    existing.isActive = !existing.isActive;
    await existing.save();
    return this.toEntity(existing.toObject());
  }

  private toEntity(doc: any): PaymentMethod {
    return {
      _id: doc._id.toString(),
      name: doc.name,
      isActive: doc.isActive,
      sortOrder: doc.sortOrder,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
