import React, { useState } from "react";
import { AdminLayout, AdminPage } from "../components/AdminLayout";
import DashboardPage from "./admin/DashboardPage.tsx";
import ProductsManagementPage from "./admin/ProductsManagementPage.tsx";
import BrandManagementPage from "./admin/BrandManagementPage.tsx";
import OrderManagementPage from "./admin/OrderManagementPage.tsx";
import UserManagementPage from "./admin/UserManagementPage.tsx";
import AnalyticsPage from "./admin/AnalyticsPage.tsx";

const AdminPanel: React.FC = () => {
  const [activePage, setActivePage] = useState<AdminPage>("dashboard");

  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardPage />;
      case "products":
        return <ProductsManagementPage />;
      case "brands":
        return <BrandManagementPage />;
      case "orders":
        return <OrderManagementPage />;
      case "users":
        return <UserManagementPage />;
      case "analytics":
        return <AnalyticsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <AdminLayout activePage={activePage} setActivePage={setActivePage}>
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        {renderContent()}
      </main>
    </AdminLayout>
  );
};

export default AdminPanel;
