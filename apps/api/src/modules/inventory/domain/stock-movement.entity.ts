import { ObjectId } from '../../../shared/types';

export type StockMovementType = 'IN' | 'OUT' | 'ADJUSTMENT';

export interface StockMovement {
  _id?: ObjectId;
  productId: ObjectId;
  type: StockMovementType;
  quantity: number;
  reason: string;
  notes?: string;
  referenceType?: 'SALE' | 'MANUAL';
  referenceId?: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
