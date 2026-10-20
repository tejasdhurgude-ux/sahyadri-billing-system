import { CartProvider } from './context/CartContext';
import { BillingPage } from './pages/BillingPage';

export default function App() {
  return (
    <CartProvider>
      <BillingPage />
    </CartProvider>
  );
}
