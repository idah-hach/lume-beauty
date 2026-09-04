import { useEffect, useState } from "react";
import { supabase } from "../supabase";

const API_URL = `${import.meta.env.VITE_API_URL}/products`;

const DashboardProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const emptyForm = {
    name: "",
    description: "",
    image: "",
    category: "",
    price: "",
    stock: "",
  };

  const [formData, setFormData] = useState(emptyForm);

  //
  // GET PRODUCTS
  //

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

  useEffect(() => {
    fetchProducts();
  }, []);

  //
  // GET AUTH TOKEN
  //

  const getAccessToken = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw new Error("You are not authenticated");
    }

    return session.access_token;
  };

  //
  // DELETE PRODUCT
  //

  const deleteProduct = async (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmDelete) return;

    try {
      const accessToken = await getAccessToken();

      const response = await fetch(`${API_URL}/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);

        throw new Error(data?.message || "Failed to delete product");
      }

      setProducts((currentProducts) =>
        currentProducts.filter((product) => product.id !== productId),
      );

      setError("");
    } catch (error) {
      console.error("Error deleting product:", error);
      setError(error.message || "Failed to delete product");
    }
  };

  //
  // EDIT PRODUCT
  //

  const editProduct = (product) => {
    setEditingProduct(product);

    setFormData({
      name: product.name || "",
      description: product.description || "",
      image: product.image || "",
      category: product.category || "",
      price: product.price ?? "",
      stock: product.stock ?? "",
    });

    setShowForm(true);
  };

  //
  // HANDLE INPUTS
  //

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  //
  // CREATE / UPDATE PRODUCT
  //

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const accessToken = await getAccessToken();

      const url = editingProduct ? `${API_URL}/${editingProduct.id}` : API_URL;

      const method = editingProduct ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          image: formData.image,
          category: formData.category,
          price: Number(formData.price),
          stock: Number(formData.stock),
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);

        throw new Error(data?.message || "Failed to save product");
      }

      const savedProduct = await response.json();

      if (editingProduct) {
        setProducts((currentProducts) =>
          currentProducts.map((product) =>
            product.id === savedProduct.id ? savedProduct : product,
          ),
        );
      } else {
        setProducts((currentProducts) => [savedProduct, ...currentProducts]);
      }

      setFormData(emptyForm);
      setEditingProduct(null);
      setShowForm(false);
      setError("");
    } catch (error) {
      console.error("Error saving product:", error);
      setError(error.message || "Failed to save product");
    }
  };

  //
  // CANCEL FORM
  //

  const cancelForm = () => {
    setFormData(emptyForm);
    setEditingProduct(null);
    setShowForm(false);
  };

  //
  // OPEN ADD FORM
  //

  const openAddForm = () => {
    setEditingProduct(null);
    setFormData(emptyForm);
    setShowForm(true);
  };

  return (
    <section className="dashboard-products">
      {/* 
          HEADER
       */}

      <div className="section-title">
        <div>
          <span>STORE MANAGEMENT</span>
          <h2>Products</h2>
        </div>

        <button className="add-product-btn" onClick={openAddForm}>
          + Add Product
        </button>
      </div>

      {/* 
          ERROR
       */}

      {error && <p>{error}</p>}

      {/* 
          FORM
       */}

      {showForm && (
        <form className="product-form" onSubmit={handleSubmit}>
          <h3>{editingProduct ? "Edit Product" : "Add Product"}</h3>

          <input
            type="text"
            name="name"
            placeholder="Product name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Product description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
          />

          <input
            type="text"
            name="image"
            placeholder="Image URL"
            value={formData.image}
            onChange={handleChange}
          />

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="stock"
            placeholder="Stock"
            min="0"
            value={formData.stock}
            onChange={handleChange}
            required
          />

          <div className="form-actions">
            <button type="button" onClick={cancelForm}>
              Cancel
            </button>

            <button type="submit">
              {editingProduct ? "Save Changes" : "Add Product"}
            </button>
          </div>
        </form>
      )}

      {/* 
          PRODUCTS TABLE
       */}

      <div className="products-table">
        <div className="product-row product-header">
          <span>Product</span>
          <span>Category</span>
          <span>Price</span>
          <span>Stock</span>
          <span>Actions</span>
        </div>

        {loading && (
          <div className="product-row">
            <span>Loading products...</span>
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="product-row">
            <span>No products found.</span>
          </div>
        )}

        {!loading &&
          products.map((product) => (
            <div className="product-row" key={product.id}>
              <span>
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: "45px",
                      height: "45px",
                      objectFit: "cover",
                      borderRadius: "6px",
                      marginRight: "10px",
                      verticalAlign: "middle",
                    }}
                  />
                ) : null}

                {product.name}
              </span>

              <span>{product.category || "-"}</span>

              <span>${product.price}</span>

              <span>{product.stock}</span>

              <div className="product-actions">
                <button onClick={() => editProduct(product)}>Edit</button>

                <button onClick={() => deleteProduct(product.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
};

export default DashboardProducts;
