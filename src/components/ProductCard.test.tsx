import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductCard } from './ProductCard';
import { products } from '../data/products';

const product = products[0];

describe('ProductCard', () => {
  it('shows Add to cart when the product is not in the cart', async () => {
    const onAdd = vi.fn();
    render(<ProductCard product={product} quantityInCart={0} onAdd={onAdd} onDecrement={vi.fn()} />);
    expect(screen.queryByRole('button', { name: /decrease quantity/i })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /add sky shot nsv-4/i }));
    expect(onAdd).toHaveBeenCalledWith(product);
  });

  it('shows a quantity stepper when the product is in the cart', async () => {
    const onAdd = vi.fn();
    const onDecrement = vi.fn();
    render(<ProductCard product={product} quantityInCart={2} onAdd={onAdd} onDecrement={onDecrement} />);
    expect(screen.getByText('2')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /increase quantity/i }));
    await userEvent.click(screen.getByRole('button', { name: /decrease quantity/i }));
    expect(onAdd).toHaveBeenCalledWith(product);
    expect(onDecrement).toHaveBeenCalledWith(product);
  });

  it('disables unavailable products', () => {
    render(<ProductCard product={{ ...product, available: false }} quantityInCart={0} onAdd={vi.fn()} onDecrement={vi.fn()} />);
    expect(screen.getByRole('button', { name: /unavailable/i })).toBeDisabled();
    expect(screen.getByText('Unavailable', { selector: 'p' })).toBeInTheDocument();
  });
});
