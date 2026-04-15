import { API_ENDPOINTS } from '../constants/api';
import type { AdminOrder, AdminProduct, UpdateOrderStatusRequest, UpsertProductRequest } from '../types/admin';
import { apiFetch } from './httpClient';

export async function fetchAdminProducts(): Promise<AdminProduct[]> {
  return apiFetch<AdminProduct[]>(API_ENDPOINTS.adminProducts);
}

export async function createAdminProduct(payload: UpsertProductRequest): Promise<AdminProduct> {
  return apiFetch<AdminProduct>(API_ENDPOINTS.adminProducts, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateAdminProduct(productId: number, payload: UpsertProductRequest): Promise<AdminProduct> {
  return apiFetch<AdminProduct>(`${API_ENDPOINTS.adminProducts}/${productId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function deleteAdminProduct(productId: number): Promise<void> {
  return apiFetch<void>(`${API_ENDPOINTS.adminProducts}/${productId}`, {
    method: 'DELETE',
  });
}

export async function fetchAdminOrders(): Promise<AdminOrder[]> {
  return apiFetch<AdminOrder[]>(API_ENDPOINTS.adminOrders);
}

export async function updateOrderStatus(orderId: number, payload: UpdateOrderStatusRequest): Promise<AdminOrder> {
  return apiFetch<AdminOrder>(`${API_ENDPOINTS.orders}/${orderId}/status`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}
