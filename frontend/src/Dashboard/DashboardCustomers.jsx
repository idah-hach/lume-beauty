import { useEffect, useMemo, useState } from "react";
import { supabase } from "../supabase";

const API_URL = "http://localhost:5000/api/orders";

const DashboardCustomers = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // =========================
  // GET AUTH TOKEN
  // =========================

  const getAccessToken = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw new Error("You are not authenticated");
    }

    return session.access_token;
  };

  // =========================
  // FETCH ORDERS
  // =========================

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const accessToken = await getAccessToken();

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "Failed to fetch orders");
      }

      if (!Array.isArray(data)) {
        throw new Error("Invalid orders response");
      }

      setOrders(data);
      setError("");
    } catch (error) {
      console.error("Error loading customers:", error);

      setOrders([]);
      setError(error.message || "Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // =========================
  // CREATE CUSTOMERS FROM ORDERS
  // =========================

  const customers = useMemo(() => {
    const customerMap = new Map();

    orders.forEach((order) => {
      const name = order.customerName || "Unknown Customer";
      const phone = order.phone || "No phone";

      const customerKey = `${name}-${phone}`;

      if (!customerMap.has(customerKey)) {
        customerMap.set(customerKey, {
          id: customerKey,
          name,
          phone,
          address: order.address || "-",
          orders: 0,
          spent: 0,
          lastOrder: order.createdAt,
          orderList: [],
        });
      }

      const customer = customerMap.get(customerKey);

      customer.orders += 1;

      if (order.status !== "CANCELLED") {
        customer.spent += Number(order.total || 0);
      }

      customer.orderList.push(order);

      if (
        order.createdAt &&
        (!customer.lastOrder ||
          new Date(order.createdAt) > new Date(customer.lastOrder))
      ) {
        customer.lastOrder = order.createdAt;
      }

      if (order.address) {
        customer.address = order.address;
      }
    });

    return Array.from(customerMap.values());
  }, [orders]);

  // =========================
  // SEARCH
  // =========================

  const filteredCustomers = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) {
      return customers;
    }

    return customers.filter((customer) => {
      return (
        customer.name.toLowerCase().includes(value) ||
        customer.phone.toLowerCase().includes(value)
      );
    });
  }, [customers, search]);

  // =========================
  // FORMAT DATE
  // =========================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString();
  };

  // =========================
  // JSX
  // =========================

  return (
    <section className="dashboard-customers">
      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="section-title">
        <div>
          <span>CUSTOMER MANAGEMENT</span>
          <h2>Customers</h2>
        </div>

        <span className="customers-count">{customers.length} Customers</span>
      </div>

      {/* =========================
          ERROR
      ========================= */}

      {error && <div className="dashboard-error">{error}</div>}

      {/* =========================
          SEARCH
      ========================= */}

      <div className="customers-toolbar">
        <input
          type="text"
          placeholder="Search by name or phone..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {/* =========================
          CUSTOMERS TABLE
      ========================= */}

      <div className="customers-table">
        {/* HEADER */}

        <div className="customer-row customer-header">
          <span>Customer</span>
          <span>Phone</span>
          <span>Orders</span>
          <span>Total Spent</span>
          <span>Status</span>
        </div>

        {/* LOADING */}

        {loading && (
          <div className="customer-row">
            <span>Loading customers...</span>
          </div>
        )}

        {/* EMPTY */}

        {!loading && customers.length === 0 && !error && (
          <div className="no-customers">No customers yet.</div>
        )}

        {/* SEARCH EMPTY */}

        {!loading && customers.length > 0 && filteredCustomers.length === 0 && (
          <div className="no-customers">No customers found.</div>
        )}

        {/* CUSTOMERS */}

        {!loading &&
          filteredCustomers.map((customer) => (
            <div className="customer-row" key={customer.id}>
              {/* CUSTOMER */}

              <button
                type="button"
                className="customer-name"
                onClick={() => setSelectedCustomer(customer)}
              >
                {customer.name}
              </button>

              {/* PHONE */}

              <span>{customer.phone}</span>

              {/* ORDERS */}

              <span>{customer.orders}</span>

              {/* TOTAL SPENT */}

              <span>${customer.spent.toFixed(2)}</span>

              {/* STATUS */}

              <span className="customer-status active">Active</span>
            </div>
          ))}
      </div>

      {/* =========================
          CUSTOMER DETAILS MODAL
      ========================= */}

      {selectedCustomer && (
        <div
          className="customer-details-overlay"
          onClick={() => setSelectedCustomer(null)}
        >
          <div
            className="customer-details"
            onClick={(event) => event.stopPropagation()}
          >
            {/* HEADER */}

            <div className="customer-details-header">
              <div>
                <span>CUSTOMER DETAILS</span>

                <h2>{selectedCustomer.name}</h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* CUSTOMER INFO */}

            <div className="customer-details-info">
              <h3>Customer Information</h3>

              <p>
                <strong>Name:</strong> {selectedCustomer.name}
              </p>

              <p>
                <strong>Phone:</strong> {selectedCustomer.phone}
              </p>

              <p>
                <strong>Address:</strong> {selectedCustomer.address}
              </p>

              <p>
                <strong>Total Orders:</strong> {selectedCustomer.orders}
              </p>

              <p>
                <strong>Total Spent:</strong> $
                {selectedCustomer.spent.toFixed(2)}
              </p>

              <p>
                <strong>Last Order:</strong>{" "}
                {formatDate(selectedCustomer.lastOrder)}
              </p>
            </div>

            {/* =========================
                ORDER HISTORY
            ========================= */}

            <div className="customer-order-history">
              <h3>Order History</h3>

              {selectedCustomer.orderList.map((order) => (
                <div className="customer-order-item" key={order.id}>
                  <div>
                    <strong>Order #{order.id}</strong>

                    <span>{formatDate(order.createdAt)}</span>
                  </div>

                  <div>
                    <strong>${Number(order.total || 0).toFixed(2)}</strong>

                    <span
                      className={`customer-order-status ${String(
                        order.status,
                      ).toLowerCase()}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* CLOSE BUTTON */}

            <button
              type="button"
              className="customer-close-button"
              onClick={() => setSelectedCustomer(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default DashboardCustomers;
