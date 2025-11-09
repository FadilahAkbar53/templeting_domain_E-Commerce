import React, { useState, useMemo, useCallback, useEffect } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import {
  RegionProvider,
  CartProvider,
  WishlistProvider,
} from "./contexts/RegionContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { useCart } from "./hooks/useRegions";
import { formatCurrency } from "./services/exportService";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/UsersPage"; // Alias for clarity, points to the repurposed UsersPage
import ProductDetailPage from "./pages/ProductDetailPage";
import WishlistPage from "./pages/WishlistPage";
import AdminPanel from "./pages/AdminPanel";
import LoginPage from "./pages/LoginPage";
import PromotionsWidget from "./plugins/SamplePluginWidget"; // Alias for repurposed plugin
import { Product } from "./types";

type Page =
  | "home"
  | "products"
  | "cart"
  | "productDetail"
  | "wishlist"
  | "admin";

const CartPage: React.FC = () => {
  const { cart, removeFromCart, getCartTotal } = useCart();

  return (
    <div className="bg-theme-bg-primary shadow-lg rounded-xl p-6 sm:p-8">
      <h1 className="text-3xl font-bold text-theme-text-base mb-6">
        Your Cart
      </h1>
      {cart.length === 0 ? (
        <p className="text-theme-text-muted">Your cart is empty.</p>
      ) : (
        <div>
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-theme-bg-tertiary rounded-lg"
              >
                <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div>
                    <h2 className="font-semibold text-theme-text-base">
                      {item.name}
                    </h2>
                    <p className="text-sm text-theme-text-muted">
                      {formatCurrency(item.price)} x {item.quantity}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between w-full sm:w-auto sm:space-x-4">
                  <p className="font-semibold text-theme-text-base">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="p-2 text-theme-text-muted hover:text-red-500 rounded-full hover:bg-theme-bg-primary"
                  >
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-theme-border flex justify-end">
            <div className="text-right">
              <p className="text-lg text-theme-text-muted">Total:</p>
              <p className="text-3xl font-bold text-theme-text-base">
                {formatCurrency(getCartTotal())}
              </p>
              <button className="mt-4 w-full px-6 py-3 text-lg font-bold text-white bg-theme-primary hover:bg-theme-primary-hover rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-primary">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [activePage, setActivePage] = useState<Page>("home");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Redirect admin to admin page on login
  useEffect(() => {
    if (user?.role === "admin") {
      setActivePage("admin");
    }
  }, [user]);

  const handlePageChange = useCallback(
    (page: Page) => {
      if (page === "admin" && user?.role !== "admin") {
        alert("Access denied. Admin only.");
        return;
      }
      if (page !== "productDetail") {
        setSelectedProduct(null);
      }
      setActivePage(page);
    },
    [user]
  );

  const handleProductSelect = useCallback((product: Product) => {
    setSelectedProduct(product);
    setActivePage("productDetail");
  }, []);

  const pageContent = useMemo(() => {
    // Admin users see admin panel only
    if (user?.role === "admin" && activePage === "admin") {
      return <AdminPanel />;
    }

    // Regular users see regular pages
    switch (activePage) {
      case "home":
        return <HomePage onProductSelect={handleProductSelect} />;
      case "products":
        return <ProductsPage onProductSelect={handleProductSelect} />;
      case "cart":
        return <CartPage />;
      case "wishlist":
        return <WishlistPage onProductSelect={handleProductSelect} />;
      case "productDetail":
        if (selectedProduct) {
          return (
            <ProductDetailPage
              product={selectedProduct}
              onBack={() => handlePageChange("products")}
            />
          );
        }
        return null;
      default:
        return <HomePage onProductSelect={handleProductSelect} />;
    }
  }, [
    activePage,
    selectedProduct,
    handleProductSelect,
    handlePageChange,
    user,
  ]);

  React.useEffect(() => {
    if (activePage === "productDetail" && !selectedProduct) {
      handlePageChange("products");
    }
  }, [activePage, selectedProduct, handlePageChange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-theme-bg-secondary">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-theme-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  // Admin users don't see the regular layout
  if (user.role === "admin") {
    return pageContent;
  }

  return (
    <>
      <PromotionsWidget />
      <Layout setActivePage={handlePageChange} activePage={activePage}>
        {pageContent}
      </Layout>
    </>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <RegionProvider>
        <WishlistProvider>
          <CartProvider>
            <AuthProvider>
              <AppContent />
            </AuthProvider>
          </CartProvider>
        </WishlistProvider>
      </RegionProvider>
    </ThemeProvider>
  );
};

export default App;
