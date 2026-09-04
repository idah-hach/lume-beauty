import { useState } from "react";

const DashboardSettings = () => {
  // =========================
  // Store Settings
  // =========================

  const [storeSettings, setStoreSettings] = useState({
    storeName: "LUMÉ Beauty",
    email: "contact@lumebeauty.com",
    phone: "+961 70 123 456",
    address: "Beirut, Lebanon",
  });

  // =========================
  // Notification Settings
  // =========================

  const [notifications, setNotifications] = useState({
    newOrders: true,
    lowStock: true,
    customerMessages: false,
  });

  // =========================
  // Handle Store Input
  // =========================

  const handleStoreChange = (event) => {
    const { name, value } = event.target;

    setStoreSettings((currentSettings) => ({
      ...currentSettings,
      [name]: value,
    }));
  };

  // =========================
  // Handle Notification
  // =========================

  const handleNotificationChange = (event) => {
    const { name, checked } = event.target;

    setNotifications((currentNotifications) => ({
      ...currentNotifications,
      [name]: checked,
    }));
  };

  // =========================
  // Save Settings
  // =========================

  const handleSave = (event) => {
    event.preventDefault();

    console.log("Store Settings:", storeSettings);
    console.log("Notifications:", notifications);

    alert("Settings saved successfully!");
  };

  // =========================
  // JSX
  // =========================

  return (
    <section className="dashboard-settings">
      {/* =========================
          HEADER
      ========================= */}

      <div className="section-title">
        <div>
          <span>STORE MANAGEMENT</span>

          <h2>Settings</h2>
        </div>
      </div>

      {/* =========================
          SETTINGS FORM
      ========================= */}

      <form className="settings-form" onSubmit={handleSave}>
        {/* =========================
            STORE INFORMATION
        ========================= */}

        <div className="settings-card">
          <div className="settings-card-header">
            <span>STORE</span>

            <h3>Store Information</h3>

            <p>Manage your store information.</p>
          </div>

          {/* Store Name */}

          <div className="form-group">
            <label>Store Name</label>

            <input
              type="text"
              name="storeName"
              value={storeSettings.storeName}
              onChange={handleStoreChange}
            />
          </div>

          {/* Email */}

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              name="email"
              value={storeSettings.email}
              onChange={handleStoreChange}
            />
          </div>

          {/* Phone */}

          <div className="form-group">
            <label>Phone</label>

            <input
              type="text"
              name="phone"
              value={storeSettings.phone}
              onChange={handleStoreChange}
            />
          </div>

          {/* Address */}

          <div className="form-group">
            <label>Address</label>

            <input
              type="text"
              name="address"
              value={storeSettings.address}
              onChange={handleStoreChange}
            />
          </div>
        </div>

        {/* =========================
            NOTIFICATIONS
        ========================= */}

        <div className="settings-card">
          <div className="settings-card-header">
            <span>NOTIFICATIONS</span>

            <h3>Notifications</h3>

            <p>Choose which notifications you want to receive.</p>
          </div>

          {/* New Orders */}

          <label className="toggle-option">
            <input
              type="checkbox"
              name="newOrders"
              checked={notifications.newOrders}
              onChange={handleNotificationChange}
            />

            <div>
              <strong>New Orders</strong>

              <p>Get notified when a new order is created.</p>
            </div>
          </label>

          {/* Low Stock */}

          <label className="toggle-option">
            <input
              type="checkbox"
              name="lowStock"
              checked={notifications.lowStock}
              onChange={handleNotificationChange}
            />

            <div>
              <strong>Low Stock</strong>

              <p>Get notified when a product stock is low.</p>
            </div>
          </label>

          {/* Customer Messages */}

          <label className="toggle-option">
            <input
              type="checkbox"
              name="customerMessages"
              checked={notifications.customerMessages}
              onChange={handleNotificationChange}
            />

            <div>
              <strong>Customer Messages</strong>

              <p>Get notified when customers send messages.</p>
            </div>
          </label>
        </div>

        {/* =========================
            SAVE BUTTON
        ========================= */}

        <div className="settings-actions">
          <button type="submit">Save Changes</button>
        </div>
      </form>
    </section>
  );
};

export default DashboardSettings;
