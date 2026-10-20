import { createContext, useMemo, useReducer, type Dispatch, type ReactNode } from 'react';
import type { CartItem } from '../types/cart';
import { cartReducer, type CartAction } from './cartReducer';
import { calculateSubtotal, calculateTotal, countUnits } from '../utils/calculations';

export interface CartContextValue {
  items: CartItem[];
  dispatch: Dispatch<CartAction>;
  subtotal: number;
  total: number;
  unitCount: number;
}

export const CartContext = createContext<CartContextValue | null>(null);

/** The cart lives in memory only: nothing is stored anywhere. */
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, []);
  const value = useMemo<CartContextValue>(
    () => ({ items, dispatch, subtotal: calculateSubtotal(items), total: calculateTotal(items), unitCount: countUnits(items) }),
    [items],
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
