import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { formatCurrency } from "../../services/exportService";

interface DashboardStats {
  totalProducts: number;
  totalUsers: number;
  totalAdmins: number;
  totalWishlists: number;
  recentUsers: Array<{
    _id: string;
    username: string;
    role: string;
    createdAt: string;
  }>;
  topWishlisted: Array<{
    _id: string;
    name: string;
    brand: string;
    price: number;
    image: string;
    wishlistCount: number;
  }>;
}

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, icon, color }) => (
  <div
    className={`bg-theme-bg-primary rounded-xl shadow-lg p-6 border-l-4 ${color}`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-theme-text-muted mb-1">
          {title}
        </p>
        <p className="text-3xl font-bold text-theme-text-base">{value}</p>
      </div>
      <div
        className={`p-3 rounded-full bg-opacity-10 ${color.replace(
          "border-",
          "bg-"
        )}`}
      >
        {icon}
      </div>
    </div>
  </div>
);

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const token = user?.token;

      const response = await fetch("http://localhost:5000/api/admin/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard stats");
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-theme-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-theme-text-base">Dashboard</h1>
        <p className="text-theme-text-muted mt-1">
          Welcome back, {user?.username}! Here's what's happening.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          color="border-blue-500"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-blue-500"
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
          }
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          color="border-green-500"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-green-500"
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
          }
        />
        <StatCard
          title="Admins"
          value={stats.totalAdmins}
          color="border-purple-500"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-purple-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          }
        />
        <StatCard
          title="Total Wishlists"
          value={stats.totalWishlists}
          color="border-red-500"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.662l1.318-1.344a4.5 4.5 0 116.364 6.364L12 20.348l-7.682-7.682a4.5 4.5 0 010-6.348z"
              />
            </svg>
          }
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Wishlisted Products */}
        <div className="bg-theme-bg-primary rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-theme-text-base mb-4">
            🔥 Most Wishlisted Products
          </h2>
          <div className="space-y-4">
            {stats.topWishlisted.length === 0 ? (
              <p className="text-theme-text-muted text-center py-8">
                No wishlist data yet
              </p>
            ) : (
              stats.topWishlisted.map((product, index) => (
                <div
                  key={product._id}
                  className="flex items-center gap-4 p-3 bg-theme-bg-secondary rounded-lg hover:bg-theme-bg-tertiary transition-colors"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-theme-primary text-white flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-theme-text-base truncate">
                      {product.name}
                    </p>
                    <p className="text-sm text-theme-text-muted">
                      {product.brand}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-theme-text-base">
                      {formatCurrency(product.price)}
                    </p>
                    <p className="text-sm text-theme-text-muted">
                      <span className="inline-flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-red-500 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {product.wishlistCount}
                      </span>
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-theme-bg-primary rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-theme-text-base mb-4">
            👥 Recent Users
          </h2>
          <div className="space-y-3">
            {stats.recentUsers.length === 0 ? (
              <p className="text-theme-text-muted text-center py-8">
                No users yet
              </p>
            ) : (
              stats.recentUsers.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between p-3 bg-theme-bg-secondary rounded-lg hover:bg-theme-bg-tertiary transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-theme-primary text-white flex items-center justify-center font-bold">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-theme-text-base">
                        {user.username}
                      </p>
                      <p className="text-sm text-theme-text-muted">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
