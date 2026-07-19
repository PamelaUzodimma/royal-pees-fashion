export interface Product {
  id: string;
  category: string;
  subCategoryName: string;
  title: string;
  price: number;
  cost: number;
  image: string | null;
  description: string;
  fabric: string;
  sizing: string;
  turnaround: string;
  sizes: string[] | null;
  active: boolean;
}

export interface StockLevel {
  productId: string;
  quantity: number;
}

/** A product merged with its live stock quantity — what the UI renders. */
export interface ProductWithStock extends Product {
  currentStock: number;
  inStock: boolean;
}

export interface CartItem {
  cartKey: string; // `${productId}` or `${productId}__${size}`
  productId: string;
  title: string;
  category: string;
  subCategoryName: string;
  price: number;
  size: string | null;
  qty: number;
}

export type Cart = Record<string, CartItem>;

export interface OrderLineItem {
  productId: string;
  title: string;
  size: string | null;
  qty: number;
  price: number;
}

export interface OrderPayload {
  orderId: string;
  items: OrderLineItem[];
  totalRevenue: number;
}

export interface SalesLogRow {
  orderId: string;
  createdAt: string;
  itemsText: string;
  totalItemsSold: number;
  revenue: number;
  profit: number;
}
