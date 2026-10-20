import { useState, type FormEvent } from 'react';
import type { CartItem } from '../types/cart';
import type { CustomerDetails } from '../types/bill';
import { validateCustomer, type CustomerFormErrors } from '../utils/validation';
import { normalizeIndianPhone } from '../utils/phone';
import { calculateSubtotal, calculateTotal } from '../utils/calculations';
import { BillPreview } from './BillPreview';

interface CheckoutFormProps {
  items: CartItem[];
  createdAt: string;
  onSubmit: (customer: CustomerDetails) => void;
  onBack: () => void;
}

export function CheckoutForm({ items, createdAt, onSubmit, onBack }: CheckoutFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<CustomerFormErrors>({});
  const [step, setStep] = useState<'details' | 'confirm'>('details');

  function handleReview(e: FormEvent) {
    e.preventDefault();
    const next = validateCustomer({ name, phone });
    setErrors(next);
    if (Object.keys(next).length === 0) setStep('confirm');
  }

  function handleConfirm() {
    onSubmit({ name: name.trim(), phone: normalizeIndianPhone(phone) ?? '' });
  }

  return (
    <section className="card checkout" aria-labelledby="checkout-title">
      <h2 id="checkout-title" className="section-title">Checkout</h2>

      {step === 'details' ? (
        <form onSubmit={handleReview} noValidate>
          <div className="field">
            <label htmlFor="customer-name" className="field__label">Customer name</label>
            <input id="customer-name" className="input" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} autoComplete="off" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} />
            {errors.name && <p id="name-error" className="field__error" role="alert">{errors.name}</p>}
          </div>
          <div className="field">
            <label htmlFor="customer-phone" className="field__label">Customer WhatsApp number</label>
            <input id="customer-phone" className="input" type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="98765 43210" autoComplete="off" aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'phone-error' : undefined} />
            {errors.phone && <p id="phone-error" className="field__error" role="alert">{errors.phone}</p>}
          </div>
          <div className="row">
            <button type="button" className="btn" onClick={onBack}>Back to cart</button>
            <button type="submit" className="btn btn--primary">Review bill</button>
          </div>
        </form>
      ) : (
        <>
          <BillPreview createdAt={createdAt} customerName={name.trim()} items={items} subtotal={calculateSubtotal(items)} total={calculateTotal(items)} />
          <div className="row">
            <button type="button" className="btn" onClick={() => setStep('details')}>Edit details</button>
            <button type="button" className="btn btn--primary" onClick={handleConfirm}>Create bill</button>
          </div>
        </>
      )}
    </section>
  );
}
