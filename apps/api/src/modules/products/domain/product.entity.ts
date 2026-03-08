import { ObjectId } from '../../../shared/types';

export interface Product {
  _id?: ObjectId;
  barcode?: string;
  sku?: string;
  name: string;
  supplier: string;
  unitOfMeasure: string;
  cost: number;
  quantity: number;
  price: number;
  category?: string;
  categoryId?: string;
  laboratory: string;
  stockMinimum?: number;
  notes?: string;
  isActive: boolean;
  deletedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductFilters {
  category?: string;
  supplier?: string;
  laboratory?: string;
  isActive?: boolean;
  search?: string;
}

export interface ProductWithCalculations extends Product {
  profit: number;
  marginPercent: number;
  isLowStock: boolean;
}
