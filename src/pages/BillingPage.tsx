import { useState } from 'react';
import { products } from '../data/products';
import { searchProducts } from '../utils/searchProducts';
import { useCart } from '../hooks/useCart';
import type { Bill, CustomerDetails } from '../types/bill';
import type { Product } from '../types/Product';
import { Header } from '../components/Header';
import { ProductSearch } from '../components/ProductSearch';
import { ProductGrid } from '../components/ProductGrid';
import { Cart } from '../components/Cart';
import { CheckoutForm } from '../components/CheckoutForm';
import { BillReady } from '../components/BillReady';

type Stage = 'shopping' | 'checkout' | 'ready';

export function BillingPage() {
  const { items, dispatch, unitCount, subtotal, total } = useCart();
  const [query, setQuery] = useState('');
  const [stage, setStage] = useState<Stage>('shopping');
  const [createdAt, setCreatedAt] = useState(() => new Date().toISOString());
  const [bill, setBill] = useState<Bill | null>(null);

  // Derived, not stored.
  const visible = searchProducts(products, query);

  function startCheckout() {
    setCreatedAt(new Date().toISOString());
    setStage('checkout');
  }

  function handleCreateBill(customer: CustomerDetails) {
    setBill({ createdAt, customer, items, subtotal, total });
    dispatch({ type: 'clear' });
    setStage('ready');
  }

  // "−" on a product card: reduce by 1 and remove the line when it reaches 0.
  function handleDecrement(product: Product) {
    const line = items.find((i) => i.productId === product.id);
    if (!line) return;
    dispatch(line.quantity <= 1 ? { type: 'remove', productId: product.id } : { type: 'decrement', productId: product.id });
  }

  function newBill() {
    setBill(null);
    setQuery('');
    setStage('shopping');
  }

  return (
    <div className="app">
      <Header cartCount={unitCount} />
      <main className="layout">
        <section className="catalogue" aria-label="Product catalogue">
          <ProductSearch query={query} onChange={setQuery} resultCount={visible.length} totalCount={products.length} />
          <ProductGrid products={visible} cartItems={items} onAdd={(product) => dispatch({ type: 'add', product })} onDecrement={handleDecrement} />
        </section>
        <aside className="sidebar">
          {stage === 'shopping' && <Cart onCheckout={startCheckout} />}
          {stage === 'checkout' && <CheckoutForm items={items} createdAt={createdAt} onSubmit={handleCreateBill} onBack={() => setStage('shopping')} />}
          {stage === 'ready' && bill && <BillReady bill={bill} onNewBill={newBill} />}
        </aside>
      </main>
    </div>
  );
}
