export interface CostItem {
  _id?: string;
  name: string;
  category?: string;
  amount: number;
  notes?: string;
}

export interface Service {
  _id?: string;
  name: string;
  category?: string;
  salePrice: number;
  estimatedDurationMinutes: number;
  laborCost: number;
  costItems: CostItem[];
  notes?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  costTotal: number;
  profit: number;
  marginPercent: number;
}
