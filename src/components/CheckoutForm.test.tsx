import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CheckoutForm } from './CheckoutForm';
import type { CartItem } from '../types/cart';

const items: CartItem[] = [{ productId: 'peacock', name: 'Peacock', packaging: '1 box', price: 250, quantity: 2 }];

function setup() {
  const onSubmit = vi.fn();
  render(<CheckoutForm items={items} createdAt="2026-01-01T10:10:10Z" onSubmit={onSubmit} onBack={() => {}} />);
  return onSubmit;
}

describe('CheckoutForm', () => {
  it('shows validation errors and does not advance', async () => {
    setup();
    await userEvent.click(screen.getByRole('button', { name: /review bill/i }));
    expect(screen.getAllByRole('alert')).toHaveLength(2);
    expect(screen.queryByRole('button', { name: /create bill/i })).not.toBeInTheDocument();
  });

  it('creates the bill with a normalised phone number', async () => {
    const onSubmit = setup();
    await userEvent.type(screen.getByLabelText(/customer name/i), 'Ravi');
    await userEvent.type(screen.getByLabelText(/whatsapp number/i), '9876543210');
    await userEvent.click(screen.getByRole('button', { name: /review bill/i }));
    await userEvent.click(screen.getByRole('button', { name: /create bill/i }));
    expect(onSubmit).toHaveBeenCalledWith({ name: 'Ravi', phone: '919876543210' });
  });
});
