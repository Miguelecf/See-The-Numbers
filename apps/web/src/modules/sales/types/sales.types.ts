export interface SaleItem {
  type: 'PRODUCT' | 'SERVICE';
  referenceId: string;
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
  _id: string;
  items: SaleItem[];
  subtotal: number;
  lineDiscountTotal?: number;
  cartDiscountPercent?: number;
  cartDiscountAmount?: number;
  total: number;
  paymentMethodId: string;
  paymentMethodNameSnapshot: string;
  customerAlias?: string;
  notes?: string;
  createdAt: string;
}

export interface CreateSaleInput {
  discountMode?: 'NONE' | 'ITEM' | 'CART';
  items: Array<{
    type: 'PRODUCT' | 'SERVICE';
    referenceId: string;
    quantity: number;
    discountPercent?: number;
  }>;
  paymentMethodId: string;
  cartDiscountPercent?: number;
  customerAlias?: string;
  notes?: string;
}
