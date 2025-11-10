import React, { useState, useMemo, useCallback, useEffect } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import { RegionProvider, WishlistProvider } from "./contexts/RegionContext";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { useCart } from "./hooks/useRegions";
import { formatCurrency } from "./services/exportService";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/UsersPage"; // Alias for clarity, points to the repurposed UsersPage
import ProductDetailPage from "./pages/ProductDetailPage";
import WishlistPage from "./pages/WishlistPage";
import CheckoutPage from "./pages/CheckoutPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import AdminPanel from "./pages/AdminPanel";
import LoginPage from "./pages/LoginPage";
import PromotionsWidget from "./plugins/SamplePluginWidget"; // Alias for repurposed plugin
import { Product } from "./types";

type Page =
  | "home"
  | "products"
  | "cart"
  | "checkout"
  | "myOrders"
  | "productDetail"
  | "wishlist"
  | "admin";

const CartPage: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    toggleSelectItem,
    toggleSelectAll,
    getSelectedTotal,
    getSelectedItemCount,
    allSelected,
  } = useCart();
  const { user } = useAuth();
  const [navigateTo, setNavigateTo] = useState<string | null>(null);

  useEffect(() => {
    if (navigateTo) {
      // This would trigger navigation in parent component
      window.dispatchEvent(new CustomEvent("navigate", { detail: navigateTo }));
      setNavigateTo(null);
    }
  }, [navigateTo]);

  const handleCheckout = () => {
    const selectedCount = getSelectedItemCount();
    if (selectedCount === 0) {
      alert("Pilih minimal 1 produk untuk checkout");
      return;
    }
    setNavigateTo("checkout");
  };

  return (
    <div className="bg-theme-bg-primary shadow-lg rounded-xl p-6 sm:p-8">
      <h1 className="text-3xl font-bold text-theme-text-base mb-6">
        Your Cart
      </h1>
      {cart.length === 0 ? (
        <p className="text-theme-text-muted">Your cart is empty.</p>
      ) : (
        <div>
          {/* Select All */}
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleSelectAll}
              className="w-5 h-5 text-theme-primary rounded focus:ring-2 focus:ring-theme-primary"
            />
            <label className="ml-3 text-theme-text-base font-medium">
              Pilih Semua ({cart.length} item)
            </label>
          </div>

          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={`${item._id}-${item.size}`}
                className="flex items-start p-4 bg-theme-bg-tertiary rounded-lg"
              >
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={item.selected}
                  onChange={() => toggleSelectItem(item._id, item.size)}
                  className="mt-1 w-5 h-5 text-theme-primary rounded focus:ring-2 focus:ring-theme-primary"
                />

                <div className="ml-4 flex flex-col sm:flex-row items-start sm:items-center justify-between flex-1">
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
                        {item.brand} • Size {item.size}
                      </p>
                      <p className="text-sm text-theme-text-muted">
                        {formatCurrency(item.price)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between w-full sm:w-auto sm:space-x-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.quantity - 1, item.size)
                        }
                        className="w-8 h-8 bg-theme-bg-primary rounded-md hover:bg-theme-border flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-semibold text-theme-text-base">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.quantity + 1, item.size)
                        }
                        className="w-8 h-8 bg-theme-bg-primary rounded-md hover:bg-theme-border flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>

                    <p className="font-semibold text-theme-text-base">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                    <button
                      onClick={() => removeFromCart(item._id, item.size)}
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
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-theme-border flex justify-between items-center">
            <div>
              <p className="text-sm text-theme-text-muted">
                {getSelectedItemCount()} item dipilih
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg text-theme-text-muted">Total:</p>
              <p className="text-3xl font-bold text-theme-text-base">
                {formatCurrency(getSelectedTotal())}
              </p>
              <button
                onClick={handleCheckout}
                className="mt-4 w-full px-6 py-3 text-lg font-bold text-white bg-theme-primary hover:bg-theme-primary-hover rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-primary"
              >
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
    } else if (user?.role === "user") {
      // Ensure regular users start at home
      setActivePage("home");
    }
  }, [user]);

  // Listen for navigation events from cart checkout
  useEffect(() => {
    const handleNavigate = (e: CustomEvent) => {
      handlePageChange(e.detail as Page);
    };
    window.addEventListener("navigate", handleNavigate as EventListener);
    return () => {
      window.removeEventListener("navigate", handleNavigate as EventListener);
    };
  }, []);

  const handlePageChange = useCallback(
    (page: Page) => {
      if (page === "admin" && user?.role !== "admin") {
        alert("Access denied. Admin only.");
        return;
      }
      if (page !== "productDetail") {
        setSelectedProduct(null);
      }

      // Trigger product refresh when navigating to home or products page
      if (page === "home" || page === "products") {
        window.dispatchEvent(new Event("refreshProducts"));
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
    // Regular users see regular pages
    switch (activePage) {
      case "home":
        return <HomePage onProductSelect={handleProductSelect} />;
      case "products":
        return <ProductsPage onProductSelect={handleProductSelect} />;
      case "cart":
        return <CartPage />;
      case "checkout":
        return <CheckoutPage />;
      case "myOrders":
        return <MyOrdersPage />;
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
        return <HomePage onProductSelect={handleProductSelect} />;
      case "admin":
        // Admin panel handled separately
        return <AdminPanel />;
      default:
        return <HomePage onProductSelect={handleProductSelect} />;
    }
  }, [activePage, selectedProduct, handleProductSelect, handlePageChange]);

  React.useEffect(() => {
    if (activePage === "productDetail" && !selectedProduct) {
      handlePageChange("products");
    }
  }, [activePage, selectedProduct, handlePageChange]);

  // Debug logging
  React.useEffect(() => {
    console.log("🔍 App State:", {
      user: user ? { username: user.username, role: user.role } : null,
      loading,
      activePage,
      selectedProduct: selectedProduct?.name || null,
    });
  }, [user, loading, activePage, selectedProduct]);

  if (loading) {
    console.log("⏳ Loading state...");
    return (
      <div className="flex items-center justify-center min-h-screen bg-theme-bg-secondary">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-theme-primary"></div>
      </div>
    );
  }

  if (!user) {
    console.log("🔐 No user, showing login page");
    return <LoginPage />;
  }

  // Admin users see admin panel without regular layout
  if (user.role === "admin") {
    console.log("👨‍💼 Rendering Admin Panel");
    return <AdminPanel />;
  }

  // Regular users see the layout with navigation
  console.log("👤 Rendering User Layout with page:", activePage);
  return (
    <>
      <PromotionsWidget />
      <Layout
        setActivePage={handlePageChange}
        activePage={activePage}
        onProductSelect={handleProductSelect}
      >
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
