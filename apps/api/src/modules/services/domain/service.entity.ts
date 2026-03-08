import { ObjectId } from '../../../shared/types';
import { CostItem } from './cost-item.entity';

export interface Service {
  _id?: ObjectId;
  name: string;
  category?: string;
  salePrice: number;
  estimatedDurationMinutes: number;
  laborCost: number;
  costItems: CostItem[];
  notes?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ServiceWithCalculations extends Service {
  costTotal: number;
  profit: number;
  marginPercent: number;
}
