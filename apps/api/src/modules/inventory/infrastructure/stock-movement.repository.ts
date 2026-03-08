import { ClientSession } from 'mongoose';
import { StockMovement } from '../domain/stock-movement.entity';
import { StockMovementModel } from './stock-movement.schema';

export class StockMovementRepository {
  async create(
    data: Omit<StockMovement, '_id' | 'createdAt' | 'updatedAt'>,
    session?: ClientSession
  ): Promise<StockMovement> {
    const doc = await StockMovementModel.create([data], { session });
    return this.toEntity(doc[0].toObject());
  }

  async findByProductId(productId: string): Promise<StockMovement[]> {
    const docs = await StockMovementModel.find({ productId }).sort({ createdAt: -1 }).lean();
    return docs.map((doc) => this.toEntity(doc));
  }

  private toEntity(doc: any): StockMovement {
    return {
      _id: doc._id.toString(),
      productId: doc.productId.toString(),
      type: doc.type,
      quantity: doc.quantity,
      reason: doc.reason,
      notes: doc.notes,
      referenceType: doc.referenceType,
      referenceId: doc.referenceId?.toString(),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
