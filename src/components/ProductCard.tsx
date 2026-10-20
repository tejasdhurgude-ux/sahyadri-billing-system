import type { Product } from '../types/Product';
import { formatCurrency } from '../utils/formatCurrency';

interface ProductCardProps {
  product: Product;
  quantityInCart: number;
  onAdd: (product: Product) => void;
  onDecrement: (product: Product) => void;
}

export function ProductCard({ product, quantityInCart, onAdd, onDecrement }: ProductCardProps) {
  return (
    <article className={`card product ${product.available ? '' : 'product--unavailable'}`}>
      <div>
        <h3 className="product__name">{product.name}</h3>
        <p className="product__pack">{product.packaging}</p>
      </div>
      <div className="product__foot">
        <div>
          <p className="product__price">{formatCurrency(product.price)}<span> / box</span></p>
          <p className={`status ${product.available ? 'status--ok' : 'status--off'}`}>
            {product.available ? 'Available' : 'Unavailable'}
          </p>
        </div>

        {!product.available ? (
          <button type="button" className="btn" disabled>Unavailable</button>
        ) : quantityInCart === 0 ? (
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => onAdd(product)}
            aria-label={`Add ${product.name} to cart`}
          >
            Add to cart
          </button>
        ) : (
          <div className="qty" role="group" aria-label={`Quantity of ${product.name} in cart`}>
            <button
              type="button"
              className="qty__btn"
              onClick={() => onDecrement(product)}
              aria-label={`Decrease quantity of ${product.name}`}
            >
              −
            </button>
            <span className="qty__value" aria-live="polite">{quantityInCart}</span>
            <button
              type="button"
              className="qty__btn"
              onClick={() => onAdd(product)}
              aria-label={`Increase quantity of ${product.name}`}
            >
              +
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
