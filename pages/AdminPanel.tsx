import React, { useState } from "react";
import {
  AdminLayout,
  AdminSidebar,
  AdminPage,
} from "../components/AdminLayout";
import DashboardPage from "./admin/DashboardPage";
import ProductsManagementPage from "./admin/ProductsManagementPage";
import BrandManagementPage from "./admin/BrandManagementPage";
import UserManagementPage from "./admin/UserManagementPage";
import AnalyticsPage from "./admin/AnalyticsPage";

const AdminPanel: React.FC = () => {
  const [activePage, setActivePage] = useState<AdminPage>("dashboard");
  const [isMinimized, setIsMinimized] = useState(false);

  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardPage />;
      case "products":
        return <ProductsManagementPage />;
      case "brands":
        return <BrandManagementPage />;
      case "users":
        return <UserManagementPage />;
      case "analytics":
        return <AnalyticsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <AdminLayout>
      <AdminSidebar
        activePage={activePage}
        setActivePage={setActivePage}
        isMinimized={isMinimized}
      />
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        {renderContent()}
      </main>
    </AdminLayout>
  );
};

export default AdminPanel;
