import { ObjectId } from '../../../shared/types';

export interface PaymentMethod {
  _id?: ObjectId;
  name: string;
  isActive: boolean;
  sortOrder?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
