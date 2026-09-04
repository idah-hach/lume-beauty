import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./Components/pages/Home";
import Checkout from "./Components/pages/Checkout";

import DashboardLayout from "./Dashboard/DashboardLayout";
import DashboardOverview from "./Dashboard/DashboardOverview";
import DashboardProducts from "./Dashboard/DashboardProducts";
import DashboardOrders from "./Dashboard/DashboardOrders";
import DashboardCustomers from "./Dashboard/DashboardCustomers";
import DashboardSettings from "./Dashboard/DashboardSettings";

import AdminLogin from "./Dashboard/AdminLogin";
import ProtectedRoute from "./Dashboard/ProtectedRoute";

function App() {
  const [cart, setCart] = useState([]);

  // =========================
  // CLEAR CART
  // =========================

  const clearCart = () => {
    setCart([]);
  };

  // =========================
  // ADD TO CART
  // =========================

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.id === product.id);

      if (existingItem) {
        return currentCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item,
        );
      }

      return [
        ...currentCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  // =========================
  // REMOVE FROM CART
  // =========================

  const removeFromCart = (productId) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== productId),
    );
  };

  // =========================
  // INCREASE QUANTITY
  // =========================

  const increaseQuantity = (productId) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item,
      ),
    );
  };

  // =========================
  // DECREASE QUANTITY
  // =========================

  const decreaseQuantity = (productId) => {
    setCart((currentCart) =>
      currentCart.flatMap((item) => {
        if (item.id !== productId) {
          return [item];
        }

        if (item.quantity <= 1) {
          return [];
        }

        return [
          {
            ...item,
            quantity: item.quantity - 1,
          },
        ];
      }),
    );
  };

  // =========================
  // CART COUNT
  // =========================

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <BrowserRouter>
      <Routes>
        {/* =========================
            NORMAL WEBSITE
        ========================= */}

        <Route
          path="/"
          element={
            <Home
              cart={cart}
              cartCount={cartCount}
              onAddToCart={addToCart}
              onRemove={removeFromCart}
              onIncrease={increaseQuantity}
              onDecrease={decreaseQuantity}
            />
          }
        />

        {/* =========================
            CHECKOUT
        ========================= */}

        <Route
          path="/checkout"
          element={
            <Checkout
              cart={cart}
              onRemove={removeFromCart}
              onIncrease={increaseQuantity}
              onDecrease={decreaseQuantity}
              onOrderCreated={clearCart}
            />
          }
        />

        {/* =========================
            ADMIN LOGIN
        ========================= */}

        <Route path="/admin/login" element={<AdminLogin />} />

        {/* =========================
            PROTECTED ADMIN DASHBOARD
        ========================= */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardOverview />} />

          <Route path="products" element={<DashboardProducts />} />

          <Route path="orders" element={<DashboardOrders />} />

          <Route path="customers" element={<DashboardCustomers />} />

          <Route path="settings" element={<DashboardSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
