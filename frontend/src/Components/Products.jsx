import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/products";

const Products = ({ onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Product currently shown in the lightbox
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Get products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        setProducts(data);
      } catch (error) {
        console.error("Error loading products:", error);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Close on Escape + lock page scroll while lightbox is open
  useEffect(() => {
    if (!selectedProduct) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setSelectedProduct(null);
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [selectedProduct]);

  return (
    <section id="shop" className="products">
      <div className="section-header">
        <span>OUR COLLECTION</span>
        <h2>Beauty Essentials</h2>
        <p>Discover our carefully selected beauty products.</p>
      </div>

      {loading && <p>Loading products...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && products.length === 0 && (
        <p>No products available.</p>
      )}

      <div className="product-grid">
        {products.map((product) => (
          <article className="product-card" key={product.id}>
            {/* Product image */}
            <div
              className="product-media"
              onClick={() => setSelectedProduct(product)}
              role="button"
              tabIndex={0}
              aria-label={`View ${product.name} full size`}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  setSelectedProduct(product);
                }
              }}
            >
              {product.image ? (
                <img src={product.image} alt={product.name} />
              ) : (
                <div className="product-image-placeholder">No image</div>
              )}

              <span className="zoom-badge" aria-hidden="true">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <circle cx="11" cy="11" r="7" />
                  <line x1="21" y1="21" x2="16.5" y2="16.5" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                  <line x1="11" y1="8" x2="11" y2="14" />
                </svg>
              </span>
            </div>

            <div className="product-info">
              <span>{product.category || "-"}</span>

              <h3>{product.name}</h3>

              <p>${product.price}</p>

              <button onClick={() => onAddToCart(product)}>Add to cart</button>
            </div>
          </article>
        ))}
      </div>

      {/* ================= LIGHTBOX ================= */}

      {selectedProduct && (
        <div
          className="lightbox-overlay"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={selectedProduct.name}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="lightbox-close"
              onClick={() => setSelectedProduct(null)}
              aria-label="Close"
            >
              ×
            </button>

            {selectedProduct.image && (
              <img src={selectedProduct.image} alt={selectedProduct.name} />
            )}

            <div className="lightbox-info">
              <span>{selectedProduct.category || "-"}</span>

              <h3>{selectedProduct.name}</h3>

              <p className="lightbox-price">${selectedProduct.price}</p>

              {selectedProduct.description && (
                <p className="lightbox-desc">{selectedProduct.description}</p>
              )}

              <button
                className="lightbox-add"
                onClick={() => {
                  onAddToCart(selectedProduct);
                  setSelectedProduct(null);
                }}
              >
                Add to cart
              </button>

              <small>Click outside or press Esc to close</small>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Products;
