import type { Product } from './Product';
import type { Order } from './order';

export interface UpsertProductRequest {
  title: string;
  description: string;
  price: number;
  stockQuantity: number;
  category: string;
  sellerName: string;
  imageUrl: string;
}

export interface UpdateOrderStatusRequest {
  status: string;
}

export type AdminProduct = Product;
export type AdminOrder = Order;
