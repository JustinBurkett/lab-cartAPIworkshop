import { API_ENDPOINTS } from '../constants/api';
import type { CartItem } from '../types/cart';

async function toApiError(response: Response, fallbackMessage: string): Promise<Error> {
  const message = await response.text();
  return new Error(message || fallbackMessage);
}

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
  const response = await fetch(API_ENDPOINTS.cart);

  if (response.status === 404) {
    return [];
  }

  if (!response.ok) {
    throw await toApiError(response, 'Failed to fetch cart data.');
  }

  const cart = (await response.json()) as CartResponse;
  return cart.items.map(mapCartItem);
}

export async function addItemToCart(productId: number, quantity = 1): Promise<void> {
  const payload: AddToCartRequest = { productId, quantity };
  const response = await fetch(API_ENDPOINTS.cart, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw await toApiError(response, 'Failed to add item to cart.');
  }
}

export async function updateCartItemQuantity(cartItemId: number, quantity: number): Promise<void> {
  const payload: UpdateCartItemRequest = { quantity };
  const response = await fetch(`${API_ENDPOINTS.cart}/${cartItemId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw await toApiError(response, 'Failed to update cart item quantity.');
  }
}

export async function removeCartItem(cartItemId: number): Promise<void> {
  const response = await fetch(`${API_ENDPOINTS.cart}/${cartItemId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw await toApiError(response, 'Failed to remove cart item.');
  }
}

export async function clearCartItems(): Promise<void> {
  const response = await fetch(`${API_ENDPOINTS.cart}/clear`, {
    method: 'DELETE',
  });

  if (response.status === 404) {
    return;
  }

  if (!response.ok) {
    throw await toApiError(response, 'Failed to clear cart.');
  }
}
