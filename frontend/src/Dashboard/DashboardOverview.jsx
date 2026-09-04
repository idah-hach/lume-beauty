import { useEffect, useState } from "react";
import { supabase } from "../supabase";

const PRODUCTS_API = `${import.meta.env.VITE_API_URL}/products`;
const ORDERS_API = `${import.meta.env.VITE_API_URL}/orders`;

const DashboardOverview = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  //
  // FETCH DASHBOARD DATA
  //

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          throw new Error("You are not authenticated");
        }

        const accessToken = session.access_token;

        const [productsResponse, ordersResponse] = await Promise.all([
          fetch(PRODUCTS_API),

          fetch(ORDERS_API, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }),
        ]);

        const productsData = await productsResponse.json().catch(() => null);

        const ordersData = await ordersResponse.json().catch(() => null);

        if (!productsResponse.ok) {
          throw new Error(productsData?.message || "Failed to fetch products");
        }

        if (!ordersResponse.ok) {
          throw new Error(ordersData?.message || "Failed to fetch orders");
        }

        setProducts(productsData);
        setOrders(ordersData);
      } catch (error) {
        console.error("Error loading dashboard:", error);

        setError(error.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  //
  // CALCULATE STATS
  //

  const totalSales = orders
    .filter((order) => order.status !== "CANCELLED")
    .reduce((total, order) => total + Number(order.total), 0);

  const totalOrders = orders.length;

  const totalProducts = products.length;

  const pendingOrders = orders.filter(
    (order) => order.status === "PENDING",
  ).length;

  const stats = [
    {
      title: "Total Sales",
      value: `$${totalSales.toFixed(2)}`,
    },
    {
      title: "Orders",
      value: totalOrders,
    },
    {
      title: "Products",
      value: totalProducts,
    },
    {
      title: "Pending Orders",
      value: pendingOrders,
    },
  ];

  //
  // RECENT ORDERS
  //

  const recentOrders = orders.slice(0, 5);

  return (
    <section className="dashboard-overview">
      {/* 
          HEADER
       */}

      <div className="overview-header">
        <span>WELCOME BACK</span>

        <h2>Dashboard Overview</h2>

        <p>Here's what's happening with your LUMÉ Beauty store.</p>
      </div>

      {/* 
          ERROR
       */}

      {error && <p className="dashboard-error">{error}</p>}

      {/* 
          STATS
       */}

      <div className="stats-grid">
        {stats.map((stat) => (
          <div className="stat-card" key={stat.title}>
            <span>{stat.title}</span>

            <h3>{loading ? "..." : stat.value}</h3>
          </div>
        ))}
      </div>

      {/* 
          RECENT ORDERS
       */}

      <div className="recent-orders">
        <div className="recent-orders-header">
          <div>
            <span>STORE ACTIVITY</span>

            <h3>Recent Orders</h3>
          </div>
        </div>

        <div className="recent-orders-table">
          {/* HEADER */}

          <div className="recent-order-row header">
            <span>Order</span>

            <span>Customer</span>

            <span>Total</span>

            <span>Status</span>
          </div>

          {/* LOADING */}

          {loading && (
            <div className="recent-order-row">
              <span>Loading orders...</span>
            </div>
          )}

          {/* EMPTY */}

          {!loading && recentOrders.length === 0 && (
            <div className="recent-order-row">
              <span>No orders yet.</span>
            </div>
          )}

          {/* ORDERS */}

          {!loading &&
            recentOrders.map((order) => (
              <div className="recent-order-row" key={order.id}>
                <span>#{order.id}</span>

                <span>{order.customerName}</span>

                <span>${Number(order.total).toFixed(2)}</span>

                <span className={`order-status ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default DashboardOverview;
