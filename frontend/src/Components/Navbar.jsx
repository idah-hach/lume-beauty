import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = ({ cart, cartCount, onRemove, onIncrease, onDecrease }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <nav className="navbar">
        <div className="logo">LUMÉ Beauty</div>

        <div className={`nav-links ${menuOpen ? "active" : ""}`}>
          <a href="#home" onClick={() => setMenuOpen(false)}>
            Home
          </a>

          <a href="#shop" onClick={() => setMenuOpen(false)}>
            Shop
          </a>

          <a href="#about" onClick={() => setMenuOpen(false)}>
            About
          </a>

          <a href="#contact" onClick={() => setMenuOpen(false)}>
            Contact
          </a>

          {/* Admin Login */}
          <Link
            to="/admin/login"
            className="admin-login-nav"
            onClick={() => setMenuOpen(false)}
          >
            Login
          </Link>
        </div>

        <div className="navbar-actions">
          {/* Admin Login - Desktop */}
          <Link
            to="/admin/login"
            className="admin-login-nav desktop-admin-login"
          >
            Login
          </Link>

          {/* Cart */}
          <button
            className="cart"
            onClick={() => setCartOpen(true)}
            aria-label="Open cart"
          >
            🛒
            <span>{cartCount}</span>
          </button>

          {/* Mobile Menu */}
          <button
            className="menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Open menu"
          >
            ☰
          </button>
        </div>
      </nav>

      {/* ================= CART ================= */}

      {cartOpen && (
        <>
          <div
            className="cart-overlay"
            onClick={() => setCartOpen(false)}
          ></div>

          <div className="cart-drawer">
            <div className="cart-header">
              <h2>Your Cart</h2>

              <button
                className="cart-close"
                onClick={() => setCartOpen(false)}
                aria-label="Close cart"
              >
                ×
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="empty-cart">
                <p>Your cart is empty.</p>

                <button onClick={() => setCartOpen(false)}>
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((product) => (
                    <div className="cart-item" key={product.id}>
                      <div className="cart-item-info">
                        <h3>{product.name}</h3>

                        <p>${product.price}</p>

                        <div className="quantity">
                          <button onClick={() => onDecrease(product.id)}>
                            −
                          </button>

                          <span>{product.quantity}</span>

                          <button onClick={() => onIncrease(product.id)}>
                            +
                          </button>
                        </div>
                      </div>

                      <button
                        className="remove-btn"
                        onClick={() => onRemove(product.id)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                <div className="cart-total">
                  <span>Total</span>

                  <strong>
                    $
                    {cart.reduce(
                      (total, product) =>
                        total + product.price * product.quantity,
                      0,
                    )}
                  </strong>
                </div>

                <Link to="/checkout" className="checkout-btn">
                  Checkout
                </Link>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
