import { createContext, useContext, useReducer, useMemo } from 'react';
import type { ReactNode } from 'react';
import { cartReducer, initialCartState } from '../reducers/cartReducer';
import type { CartAction, CartState } from '../types/cart';

interface CartContextValue {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  cartItemCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextValue | null>(null);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  const cartItemCount = useMemo(
    () => state.items.reduce((sum, item) => sum + item.quantity, 0),
    [state.items]
  );

  const cartTotal = useMemo(
    () => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [state.items]
  );

  const value: CartContextValue = { state, dispatch, cartItemCount, cartTotal };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartContext(): CartContextValue {
  const context = useContext(CartContext);
  if (context === null) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
}
