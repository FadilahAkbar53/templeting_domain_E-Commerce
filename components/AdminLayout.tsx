import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

interface AdminLayoutProps {
  children: React.ReactNode;
}

type AdminPage =
  | "dashboard"
  | "products"
  | "brands"
  | "orders"
  | "users"
  | "analytics";

interface AdminSidebarProps {
  activePage: AdminPage;
  setActivePage: (page: AdminPage) => void;
  isMinimized: boolean;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activePage,
  setActivePage,
  isMinimized,
}) => {
  const menuItems = [
    {
      id: "dashboard" as AdminPage,
      label: "Dashboard",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      id: "products" as AdminPage,
      label: "Products",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
      ),
    },
    {
      id: "brands" as AdminPage,
      label: "Brands",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
          />
        </svg>
      ),
    },
    {
      id: "orders" as AdminPage,
      label: "Orders",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      ),
    },
    {
      id: "users" as AdminPage,
      label: "Users",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
    },
    {
      id: "analytics" as AdminPage,
      label: "Analytics",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
  ];

  return (
    <aside
      className={`bg-theme-bg-primary border-r border-theme-border transition-all duration-300 ${
        isMinimized ? "w-20" : "w-64"
      }`}
    >
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activePage === item.id
                ? "bg-theme-primary text-white"
                : "text-theme-text-base hover:bg-theme-bg-tertiary"
            } ${isMinimized ? "justify-center" : ""}`}
          >
            {item.icon}
            {!isMinimized && <span className="font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>
    </aside>
  );
};

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-theme-bg-secondary">
      {/* Admin Header */}
      <header className="bg-theme-bg-primary shadow-md px-6 py-4 border-b border-theme-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 rounded-lg hover:bg-theme-bg-tertiary text-theme-text-muted transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <div className="flex items-center space-x-2">
              <svg
                id="Layer_1"
                data-name="Layer 1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 29.93 64.06"
                className="h-8 w-auto text-theme-primary"
                fill="currentColor"
              >
                <polygon points="29.93 38.78 25.78 33.15 23.17 35.08 23.16 35.09 28.99 6.06 28.99 6.06 25.49 0 0 14.72 2.21 21.52 20.91 10.73 20.91 10.73 14.79 41.26 14.78 41.26 9.81 44.92 12.09 51.93 21.12 45.28 29.93 38.78" />
                <polygon points="13.85 57.36 16.03 64.06 23.08 64.06 25.26 57.36 19.55 53.21 13.85 57.36" />
              </svg>
              <h1 className="text-2xl font-bold text-theme-text-base">
                OneDering Admin
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-sm text-theme-text-muted">
              Welcome,{" "}
              <span className="font-semibold text-theme-text-base">
                {user?.username}
              </span>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar akan di-inject dari children jika diperlukan */}
        {children}
      </div>
    </div>
  );
};

export { AdminLayout, AdminSidebar };
export type { AdminPage };
