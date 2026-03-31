import type { CartAction, CartState } from '../types/cart';

export const initialCartState: CartState = {
  items: [],
  isOpen: false,
  isLoading: false,
  error: null,
};

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_CART_ITEMS':
      return { ...state, items: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };
  }
}
