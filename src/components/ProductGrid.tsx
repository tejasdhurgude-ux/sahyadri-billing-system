import type { Product } from '../types/Product';
import type { CartItem } from '../types/cart';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  cartItems: CartItem[];
  onAdd: (product: Product) => void;
  onDecrement: (product: Product) => void;
}

export function ProductGrid({ products, cartItems, onAdd, onDecrement }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="empty" role="status">
        <p className="empty__title">No products match your search</p>
        <p>Check the spelling or clear the search box to see the full catalogue.</p>
      </div>
    );
  }
  return (
    <div className="grid">
      {products.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          quantityInCart={cartItems.find((i) => i.productId === p.id)?.quantity ?? 0}
          onAdd={onAdd}
          onDecrement={onDecrement}
        />
      ))}
    </div>
  );
}
