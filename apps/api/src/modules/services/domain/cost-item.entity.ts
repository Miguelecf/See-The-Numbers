import { ObjectId } from '../../../shared/types';

export interface CostItem {
  _id?: ObjectId;
  name: string;
  category?: string;
  amount: number;
  notes?: string;
}
