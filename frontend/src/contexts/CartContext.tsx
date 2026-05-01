import { createContext, useContext, useReducer, useMemo, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { cartReducer, initialCartState } from '../reducers/cartReducer';
import type { CartItem, CartState } from '../types/cart';
import { useAuthContext } from './AuthContext';
import {
  addItemToCart,
  clearCartItems,
  fetchCartItems,
  removeCartItem,
  updateCartItemQuantity,
} from '../services/cartApi';

interface AddProductInput {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
}

interface CartContextValue {
  state: CartState;
  cartItemCount: number;
  cartTotal: number;
  refreshCart: (showLoading?: boolean) => Promise<void>;
  addToCart: (product: AddProductInput) => Promise<void>;
  updateQuantity: (item: CartItem, quantity: number) => Promise<void>;
  removeFromCart: (item: CartItem) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

interface CartProviderProps {
  children: ReactNode;
}

const GUEST_CART_KEY = 'buckeye_guest_cart';

export function CartProvider({ children }: CartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);
  const { isAuthenticated } = useAuthContext();

  const loadGuestCart = useCallback(() => {
    try {
      const stored = localStorage.getItem(GUEST_CART_KEY);
      if (stored) {
        const items = JSON.parse(stored) as CartItem[];
        dispatch({ type: 'SET_CART_ITEMS', payload: items });
      }
    } catch {
      // Ignore parsing errors, just use empty cart
    }
  }, []);

  const saveGuestCart = useCallback((items: CartItem[]) => {
    try {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
    } catch {
      // Ignore storage errors
    }
  }, []);

  const refreshCart = useCallback(async (showLoading = false) => {
    if (!isAuthenticated) {
      loadGuestCart();
      dispatch({ type: 'SET_ERROR', payload: null });
      dispatch({ type: 'SET_LOADING', payload: false });
      return;
    }

    if (showLoading) {
      dispatch({ type: 'SET_LOADING', payload: true });
    }

    try {
      const items = await fetchCartItems();
      dispatch({ type: 'SET_CART_ITEMS', payload: items });
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unable to load cart.' });
    } finally {
      if (showLoading) {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }
  }, [isAuthenticated, loadGuestCart]);

  useEffect(() => {
    void refreshCart(true);
  }, [refreshCart]);

  const addToCart = useCallback(async (product: AddProductInput) => {
    dispatch({ type: 'SET_ERROR', payload: null });

    const existingItem = state.items.find((item) => item.productId === product.id);
    const optimisticItems = existingItem
      ? state.items.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      : [
          ...state.items,
          {
            cartItemId: -Date.now(),
            productId: product.id,
            productName: product.name,
            price: product.price,
            quantity: 1,
            imageUrl: product.imageUrl,
          },
        ];

    dispatch({ type: 'SET_CART_ITEMS', payload: optimisticItems });

    if (isAuthenticated) {
      try {
        await addItemToCart(product.id, 1);
        await refreshCart(false);
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unable to add item to cart.' });
        dispatch({ type: 'SET_CART_ITEMS', payload: state.items });
        throw error;
      }
    } else {
      // Save guest cart to localStorage
      saveGuestCart(optimisticItems);
    }
  }, [isAuthenticated, refreshCart, saveGuestCart, state.items]);

  const updateQuantity = useCallback(async (item: CartItem, quantity: number) => {
    dispatch({ type: 'SET_ERROR', payload: null });

    const previousItems = state.items;
    const optimisticItems = state.items.map((currentItem) =>
      currentItem.cartItemId === item.cartItemId
        ? { ...currentItem, quantity }
        : currentItem
    );

    dispatch({ type: 'SET_CART_ITEMS', payload: optimisticItems });

    if (isAuthenticated) {
      try {
        await updateCartItemQuantity(item.cartItemId, quantity);
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unable to update cart quantity.' });
        dispatch({ type: 'SET_CART_ITEMS', payload: previousItems });
        throw error;
      }
    } else {
      // Save guest cart to localStorage
      saveGuestCart(optimisticItems);
    }
  }, [isAuthenticated, state.items, saveGuestCart]);

  const removeFromCart = useCallback(async (item: CartItem) => {
    dispatch({ type: 'SET_ERROR', payload: null });

    const previousItems = state.items;
    const optimisticItems = state.items.filter((currentItem) => currentItem.cartItemId !== item.cartItemId);
    dispatch({ type: 'SET_CART_ITEMS', payload: optimisticItems });

    if (isAuthenticated) {
      try {
        await removeCartItem(item.cartItemId);
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unable to remove item from cart.' });
        dispatch({ type: 'SET_CART_ITEMS', payload: previousItems });
        throw error;
      }
    } else {
      // Save guest cart to localStorage
      saveGuestCart(optimisticItems);
    }
  }, [isAuthenticated, state.items, saveGuestCart]);

  const clearCart = useCallback(async () => {
    dispatch({ type: 'SET_ERROR', payload: null });

    const previousItems = state.items;
    dispatch({ type: 'SET_CART_ITEMS', payload: [] });

    if (isAuthenticated) {
      try {
        await clearCartItems();
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unable to clear cart.' });
        dispatch({ type: 'SET_CART_ITEMS', payload: previousItems });
        throw error;
      }
    } else {
      // Clear guest cart from localStorage
      saveGuestCart([]);
    }
  }, [isAuthenticated, state.items, saveGuestCart]);

  const cartItemCount = useMemo(
    () => state.items.reduce((sum, item) => sum + item.quantity, 0),
    [state.items]
  );

  const cartTotal = useMemo(
    () => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [state.items]
  );

  const value: CartContextValue = {
    state,
    cartItemCount,
    cartTotal,
    refreshCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartContext(): CartContextValue {
  const context = useContext(CartContext);
  if (context === null) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
}
