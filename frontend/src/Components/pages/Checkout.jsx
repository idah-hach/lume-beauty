import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api/orders";

const Checkout = ({
  cart,
  onRemove,
  onIncrease,
  onDecrease,
  onOrderCreated,
}) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    address: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const total = cart.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0,
  );

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  // =========================
  // PLACE ORDER
  // =========================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: formData.customerName,
          phone: formData.phone,
          address: formData.address,
          notes: formData.notes,

          items: cart.map((product) => ({
            productId: product.id,
            quantity: product.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to place order");
      }

      // Empty cart after successful order
      if (onOrderCreated) {
        onOrderCreated();
      }

      setSuccess(true);
    } catch (error) {
      console.error("Error placing order:", error);

      setError(error.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // SUCCESS PAGE
  // =========================

  if (success) {
    return (
      <section className="checkout-page">
        <div className="checkout-container">
          <div className="order-success">
            <span>ORDER CONFIRMED</span>

            <h1>Thank You!</h1>

            <p>Your order has been placed successfully.</p>

            <Link to="/" className="checkout-back-btn">
              Continue Shopping
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="checkout-page">
      <div className="checkout-container">
        {/* =========================
            HEADER
        ========================= */}

        <div className="checkout-header">
          <span>YOUR ORDER</span>

          <h1>Checkout</h1>

          <p>Review your products and complete your order.</p>
        </div>

        {/* =========================
            EMPTY CART
        ========================= */}

        {cart.length === 0 ? (
          <div className="empty-checkout">
            <h2>Your cart is empty.</h2>

            <p>Add some products before continuing.</p>

            <Link to="/" className="checkout-back-btn">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <form className="checkout-content" onSubmit={handleSubmit}>
            {/* =========================
                ORDER ITEMS
            ========================= */}

            <div className="checkout-items">
              <h2>Your Products</h2>

              {cart.map((product) => (
                <div className="checkout-item" key={product.id}>
                  {product.image ? (
                    <img src={product.image} alt={product.name} />
                  ) : (
                    <div className="checkout-image-placeholder">No image</div>
                  )}

                  <div className="checkout-item-info">
                    <h3>{product.name}</h3>

                    <p>${product.price}</p>

                    <div className="quantity">
                      <button
                        type="button"
                        onClick={() => onDecrease(product.id)}
                      >
                        −
                      </button>

                      <span>{product.quantity}</span>

                      <button
                        type="button"
                        onClick={() => onIncrease(product.id)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="checkout-item-right">
                    <strong>
                      ${(product.price * product.quantity).toFixed(2)}
                    </strong>

                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => onRemove(product.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* =========================
                CUSTOMER INFORMATION
            ========================= */}

            <div className="checkout-form">
              <h2>Customer Information</h2>

              <input
                type="text"
                name="customerName"
                placeholder="Full name"
                value={formData.customerName}
                onChange={handleChange}
                required
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone number"
                value={formData.phone}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                required
              />

              <textarea
                name="notes"
                placeholder="Order notes (optional)"
                rows="4"
                value={formData.notes}
                onChange={handleChange}
              />
            </div>

            {/* =========================
                ERROR
            ========================= */}

            {error && <p className="checkout-error">{error}</p>}

            {/* =========================
                SUMMARY
            ========================= */}

            <div className="checkout-summary">
              <div>
                <span>Subtotal</span>

                <strong>${total.toFixed(2)}</strong>
              </div>

              <div>
                <span>Delivery</span>

                <strong>To be confirmed</strong>
              </div>

              <div className="checkout-total">
                <span>Total</span>

                <strong>${total.toFixed(2)}</strong>
              </div>

              <button
                type="submit"
                className="place-order-btn"
                disabled={loading}
              >
                {loading ? "Placing Order..." : "Place Order"}
              </button>

              <Link to="/" className="continue-shopping">
                ← Continue Shopping
              </Link>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

export default Checkout;
