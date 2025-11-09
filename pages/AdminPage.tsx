import React from "react";
import AdminPanel from "./AdminPanel";

// This file is kept for backward compatibility
// All admin functionality has been moved to AdminPanel with sidebar navigation
const AdminPage: React.FC = () => {
  return <AdminPanel />;
};

export default AdminPage;
