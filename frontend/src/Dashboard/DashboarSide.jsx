import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

const DashboardSide = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  return (
    <aside className="dashboard-sidebar">
      <div className="dashboard-logo">
        LUMÉ Beauty
        <span>ADMIN</span>
      </div>

      <nav className="dashboard-nav">
        <NavLink to="/admin" end>
          Overview
        </NavLink>

        <NavLink to="/admin/products">Products</NavLink>

        <NavLink to="/admin/orders">Orders</NavLink>

        <NavLink to="/admin/customers">Customers</NavLink>

        <NavLink to="/admin/settings">Settings</NavLink>
      </nav>

      <button
        type="button"
        className="admin-logout-button"
        onClick={handleLogout}
      >
        Logout
      </button>
    </aside>
  );
};

export default DashboardSide;
