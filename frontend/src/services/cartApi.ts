import { API_ENDPOINTS } from '../constants/api';
import type { CartItem } from '../types/cart';
import { apiFetch, ApiError } from './httpClient';

interface CartItemResponse {
  cartItemId: number;
  productId: number;
  productName: string;
  price: number;
  imageUrl?: string;
  quantity: number;
}

interface CartResponse {
  id: number;
  userId: string;
  items: CartItemResponse[];
  totalItems: number;
  subtotal: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

interface AddToCartRequest {
  productId: number;
  quantity: number;
}

interface UpdateCartItemRequest {
  quantity: number;
}

function mapCartItem(item: CartItemResponse): CartItem {
  return {
    cartItemId: item.cartItemId,
    productId: item.productId,
    productName: item.productName,
    price: item.price,
    quantity: item.quantity,
    imageUrl: item.imageUrl,
  };
}

export async function fetchCartItems(): Promise<CartItem[]> {
  try {
    const cart = await apiFetch<CartResponse>(API_ENDPOINTS.cart);
    return cart.items.map(mapCartItem);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return [];
    }

    throw error;
  }
}

export async function addItemToCart(productId: number, quantity = 1): Promise<void> {
  const payload: AddToCartRequest = { productId, quantity };
  await apiFetch<void>(API_ENDPOINTS.cart, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateCartItemQuantity(cartItemId: number, quantity: number): Promise<void> {
  const payload: UpdateCartItemRequest = { quantity };
  await apiFetch<void>(`${API_ENDPOINTS.cart}/${cartItemId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function removeCartItem(cartItemId: number): Promise<void> {
  await apiFetch<void>(`${API_ENDPOINTS.cart}/${cartItemId}`, {
    method: 'DELETE',
  });
}

export async function clearCartItems(): Promise<void> {
  try {
    await apiFetch<void>(`${API_ENDPOINTS.cart}/clear`, {
      method: 'DELETE',
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return;
    }

    throw error;
  }
}
