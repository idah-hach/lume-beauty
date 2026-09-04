import { Outlet } from "react-router-dom";
import "./Dashcoard.css";
import DashboardSide from "./DashboarSide";

const DashboardLayout = () => {
  return (
    <div className="dashboard-layout">
      <DashboardSide />

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <span>ADMIN PANEL</span>
            <h1>LUMÉ Beauty</h1>
          </div>

          <div className="admin-profile">
            <span>Admin</span>
          </div>
        </header>

        <div className="dashboard-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
