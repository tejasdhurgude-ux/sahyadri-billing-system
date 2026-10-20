import type { CartItem } from './cart';

export interface CustomerDetails {
  name: string;
  /** Normalised international format, e.g. 919876543210 */
  phone: string;
}

export interface Bill {
  createdAt: string; // ISO timestamp
  customer: CustomerDetails;
  items: CartItem[];
  subtotal: number;
  total: number;
}
