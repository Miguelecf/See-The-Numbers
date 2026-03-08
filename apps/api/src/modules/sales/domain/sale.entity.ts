import { ObjectId } from '../../../shared/types';

export type SaleItemType = 'PRODUCT' | 'SERVICE';

export interface SaleItem {
  type: SaleItemType;
  referenceId: ObjectId;
  nameSnapshot: string;
  unitPrice: number;
  quantity: number;
  lineSubtotal: number;
  discountPercent?: number;
  discountAmount?: number;
  lineTotal: number;
  costSnapshot?: number;
  profitSnapshot?: number;
}

export interface Sale {
  _id?: ObjectId;
  items: SaleItem[];
  subtotal: number;
  lineDiscountTotal?: number;
  cartDiscountPercent?: number;
  cartDiscountAmount?: number;
  total: number;
  paymentMethodId: ObjectId;
  paymentMethodNameSnapshot: string;
  customerAlias?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateSaleItemInput {
  type: SaleItemType;
  referenceId: string;
  quantity: number;
  discountPercent?: number;
}

export interface CreateSaleInput {
  items: CreateSaleItemInput[];
  paymentMethodId: string;
  cartDiscountPercent?: number;
  customerAlias?: string;
  notes?: string;
}
