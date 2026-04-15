import { API_ENDPOINTS } from '../constants/api';
import type { Order, PlaceOrderRequest } from '../types/order';
import { apiFetch } from './httpClient';

export async function placeOrder(payload: PlaceOrderRequest): Promise<Order> {
  return apiFetch<Order>(API_ENDPOINTS.orders, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function fetchMyOrders(): Promise<Order[]> {
  return apiFetch<Order[]>(`${API_ENDPOINTS.orders}/mine`);
}
