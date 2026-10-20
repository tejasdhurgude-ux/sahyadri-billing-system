import { LOGO_SVG } from '../assets/logo';

interface HeaderProps {
  cartCount: number;
}

export function Header({ cartCount }: HeaderProps) {
  return (
    <header className="header">
      <div className="header__brand">
        {/* LOGO_SVG is a trusted constant from our own source, not user input */}
        <span className="header__logo" dangerouslySetInnerHTML={{ __html: LOGO_SVG }} />
        <div>
          <p className="header__name">Sahyadri Wholesale Fataka</p>
          <p className="header__title">Lonand · Billing</p>
        </div>
      </div>
      <a className="header__cart" href="#cart" aria-label={`${cartCount} items in cart`}>
        Cart <span className="badge">{cartCount}</span>
      </a>
    </header>
  );
}
