export interface OrderItem {
  productId: number;
  productTitle: string;
  unitPrice: number;
  quantity: number;
}

export interface Order {
  id: number;
  userId: string;
  orderDate: string;
  confirmationNumber: string;
  shippingAddress: string;
  total: number;
  status: string;
  items: OrderItem[];
}

export interface PlaceOrderRequest {
  shippingAddress: string;
}
