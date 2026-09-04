import { useEffect, useState } from "react";
import { supabase } from "../supabase";

const API_URL = "http://localhost:5000/api/orders";

const DashboardOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

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
  // FETCH ORDERS
  //

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const accessToken = await getAccessToken();

      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "Failed to fetch orders");
      }

      setOrders(data);
    } catch (error) {
      console.error("Error loading orders:", error);
      setError(error.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  //
  // UPDATE STATUS
  //

  const updateStatus = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(true);
      setError("");

      const accessToken = await getAccessToken();

      const response = await fetch(`${API_URL}/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "Failed to update order status");
      }

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: data.status,
              }
            : order,
        ),
      );

      setSelectedOrder((currentOrder) =>
        currentOrder && currentOrder.id === orderId
          ? {
              ...currentOrder,
              status: data.status,
            }
          : currentOrder,
      );
    } catch (error) {
      console.error("Error updating order:", error);

      setError(error.message || "Failed to update order status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  //
  // FORMAT DATE
  //

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  //
  // GET ITEM COUNT
  //

  const getItemCount = (order) => {
    return order.items.reduce((total, item) => total + item.quantity, 0);
  };

  //
  // JSX
  //

  return (
    <section className="dashboard-orders">
      {/* 
          PAGE HEADER
       */}

      <div className="section-title">
        <div>
          <span>STORE MANAGEMENT</span>
          <h2>Orders</h2>
        </div>

        <span className="orders-count">{orders.length} Orders</span>
      </div>

      {/* 
          ERROR
       */}

      {error && <p className="dashboard-error">{error}</p>}

      {/* 
          ORDERS TABLE
       */}

      <div className="orders-table">
        <div className="order-row order-header">
          <span>Order</span>
          <span>Customer</span>
          <span>Items</span>
          <span>Total</span>
          <span>Status</span>
        </div>

        {/* LOADING */}

        {loading && (
          <div className="order-row">
            <span>Loading orders...</span>
          </div>
        )}

        {/* EMPTY */}

        {!loading && orders.length === 0 && (
          <div className="order-row">
            <span>No orders found.</span>
          </div>
        )}

        {/* ORDERS */}

        {!loading &&
          orders.map((order) => (
            <div className="order-row" key={order.id}>
              {/* ORDER ID */}

              <button
                className="order-id"
                onClick={() => setSelectedOrder(order)}
              >
                #{order.id}
              </button>

              {/* CUSTOMER */}

              <span>{order.customerName}</span>

              {/* ITEMS */}

              <span>{getItemCount(order)} items</span>

              {/* TOTAL */}

              <span>${Number(order.total).toFixed(2)}</span>

              {/* STATUS */}

              <select
                value={order.status}
                disabled={updatingStatus}
                onChange={(event) => updateStatus(order.id, event.target.value)}
              >
                <option value="PENDING">Pending</option>

                <option value="CONFIRMED">Confirmed</option>

                <option value="SHIPPED">Shipped</option>

                <option value="DELIVERED">Delivered</option>

                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          ))}
      </div>

      {/* 
          ORDER DETAILS
       */}

      {selectedOrder && (
        <div
          className="order-details-overlay"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="order-details"
            onClick={(event) => event.stopPropagation()}
          >
            {/* HEADER */}

            <div className="order-details-header">
              <div>
                <span>ORDER DETAILS</span>

                <h2>Order #{selectedOrder.id}</h2>
              </div>

              <button onClick={() => setSelectedOrder(null)} aria-label="Close">
                ×
              </button>
            </div>

            {/* CUSTOMER */}

            <div className="customer-info">
              <h3>Customer Information</h3>

              <p>
                <strong>Name:</strong> {selectedOrder.customerName}
              </p>

              <p>
                <strong>Phone:</strong> {selectedOrder.phone}
              </p>

              <p>
                <strong>Address:</strong> {selectedOrder.address}
              </p>

              {selectedOrder.notes && (
                <p>
                  <strong>Notes:</strong> {selectedOrder.notes}
                </p>
              )}

              <p>
                <strong>Date:</strong> {formatDate(selectedOrder.createdAt)}
              </p>
            </div>

            {/* PRODUCTS */}

            <div className="order-summary">
              <h3>Order Products</h3>

              {selectedOrder.items.map((item) => (
                <div className="order-product" key={item.id}>
                  <div>
                    <strong>{item.product.name}</strong>

                    <p>Quantity: {item.quantity}</p>
                  </div>

                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}

              <div className="order-final-total">
                <strong>Total</strong>

                <strong>${Number(selectedOrder.total).toFixed(2)}</strong>
              </div>
            </div>

            {/* STATUS */}

            <div className="order-status">
              <label>Update Status</label>

              <select
                value={selectedOrder.status}
                disabled={updatingStatus}
                onChange={(event) =>
                  updateStatus(selectedOrder.id, event.target.value)
                }
              >
                <option value="PENDING">Pending</option>

                <option value="CONFIRMED">Confirmed</option>

                <option value="SHIPPED">Shipped</option>

                <option value="DELIVERED">Delivered</option>

                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default DashboardOrders;
