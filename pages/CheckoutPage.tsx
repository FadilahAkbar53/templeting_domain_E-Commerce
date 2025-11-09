import React, { useState, useContext, useEffect } from "react";
import { CartContext } from "../contexts/CartContext";
import { AuthContext } from "../contexts/AuthContext";
import { ShippingAddress, ShippingService } from "../types";

const SHIPPING_SERVICES = [
  { name: "JNE Regular", cost: 15000, estimatedDays: "3-4 hari" },
  { name: "JNE Express", cost: 25000, estimatedDays: "1-2 hari" },
  { name: "JNT Regular", cost: 12000, estimatedDays: "3-5 hari" },
  { name: "JNT Express", cost: 22000, estimatedDays: "2-3 hari" },
  { name: "SiCepat Regular", cost: 13000, estimatedDays: "2-4 hari" },
  { name: "SiCepat Express", cost: 23000, estimatedDays: "1-2 hari" },
];

const PAYMENT_METHODS = ["COD", "Bank Transfer", "E-Wallet", "Credit Card"];

const CheckoutPage: React.FC = () => {
  const cartContext = useContext(CartContext);
  const authContext = useContext(AuthContext);

  if (!cartContext || !authContext) {
    throw new Error(
      "CheckoutPage must be used within CartProvider and AuthProvider"
    );
  }

  const { getSelectedItems, clearSelectedItems } = cartContext;
  const { user } = authContext;

  const selectedItems = getSelectedItems();

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
  });

  const [selectedShipping, setSelectedShipping] =
    useState<ShippingService | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (selectedItems.length === 0) {
      // Navigate back to home if no items selected
      window.dispatchEvent(new CustomEvent("navigate", { detail: "home" }));
    }
  }, [selectedItems]);

  const itemsPrice = selectedItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const totalPrice = itemsPrice + (selectedShipping?.cost || 0);

  const handleShippingChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateOrder = async () => {
    // Validation
    if (
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.province ||
      !shippingAddress.postalCode
    ) {
      setError("Mohon lengkapi semua data alamat pengiriman");
      return;
    }

    if (!selectedShipping) {
      setError("Mohon pilih layanan pengiriman");
      return;
    }

    if (!selectedPayment) {
      setError("Mohon pilih metode pembayaran");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const orderData = {
        items: selectedItems.map((item) => ({
          product: item._id,
          quantity: item.quantity,
          size: item.size,
        })),
        shippingAddress,
        shippingService: selectedShipping,
        paymentMethod: selectedPayment,
      };

      console.log("🛒 Sending order data:", orderData);
      console.log("🔐 Token:", user?.token?.substring(0, 20) + "...");

      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(orderData),
      });

      console.log("📡 Response status:", response.status);

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Unknown error" }));
        console.error("❌ Order creation failed:", errorData);
        throw new Error(errorData.message || "Gagal membuat pesanan");
      }

      const order = await response.json();
      console.log("✅ Order created:", order);

      // Clear selected items from cart
      clearSelectedItems();

      // Navigate to my orders page
      alert(`Pesanan berhasil dibuat! Nomor Order: ${order.orderNumber}`);
      window.dispatchEvent(new CustomEvent("navigate", { detail: "myOrders" }));
    } catch (err: any) {
      console.error("❌ Checkout error:", err);
      setError(err.message || "Terjadi kesalahan saat membuat pesanan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-theme-text-base mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-theme-bg-secondary rounded-lg p-6">
            <h2 className="text-xl font-bold text-theme-text-base mb-4">
              Produk yang Dipesan ({selectedItems.length} item)
            </h2>
            <div className="space-y-4">
              {selectedItems.map((item) => (
                <div
                  key={`${item._id}-${item.size}`}
                  className="flex gap-4 border-b border-theme-border pb-4 last:border-0"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-theme-text-base">
                      {item.name}
                    </h3>
                    <p className="text-sm text-theme-text-muted">
                      {item.brand}
                    </p>
                    <p className="text-sm text-theme-text-muted">
                      Size: {item.size}
                    </p>
                    <p className="text-sm text-theme-text-muted">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-theme-primary">
                      Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-theme-bg-secondary rounded-lg p-6">
            <h2 className="text-xl font-bold text-theme-text-base mb-4">
              Alamat Pengiriman
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-theme-text-muted mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={shippingAddress.fullName}
                  onChange={handleShippingChange}
                  className="w-full bg-theme-bg-tertiary border border-theme-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-theme-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-theme-text-muted mb-1">
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={shippingAddress.phone}
                  onChange={handleShippingChange}
                  className="w-full bg-theme-bg-tertiary border border-theme-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-theme-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-theme-text-muted mb-1">
                  Kode Pos
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={shippingAddress.postalCode}
                  onChange={handleShippingChange}
                  className="w-full bg-theme-bg-tertiary border border-theme-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-theme-primary"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-theme-text-muted mb-1">
                  Alamat Lengkap
                </label>
                <textarea
                  name="address"
                  value={shippingAddress.address}
                  onChange={handleShippingChange}
                  rows={3}
                  className="w-full bg-theme-bg-tertiary border border-theme-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-theme-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-theme-text-muted mb-1">
                  Kota/Kabupaten
                </label>
                <input
                  type="text"
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleShippingChange}
                  className="w-full bg-theme-bg-tertiary border border-theme-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-theme-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-theme-text-muted mb-1">
                  Provinsi
                </label>
                <input
                  type="text"
                  name="province"
                  value={shippingAddress.province}
                  onChange={handleShippingChange}
                  className="w-full bg-theme-bg-tertiary border border-theme-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-theme-primary"
                  required
                />
              </div>
            </div>
          </div>

          {/* Shipping Service */}
          <div className="bg-theme-bg-secondary rounded-lg p-6">
            <h2 className="text-xl font-bold text-theme-text-base mb-4">
              Layanan Pengiriman
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {SHIPPING_SERVICES.map((service) => (
                <div
                  key={service.name}
                  onClick={() => setSelectedShipping(service)}
                  className={`border rounded-lg p-4 cursor-pointer transition ${
                    selectedShipping?.name === service.name
                      ? "border-theme-primary bg-theme-primary/10"
                      : "border-theme-border hover:border-theme-primary/50"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-theme-text-base">
                        {service.name}
                      </h3>
                      <p className="text-sm text-theme-text-muted">
                        Estimasi: {service.estimatedDays}
                      </p>
                    </div>
                    <p className="font-bold text-theme-primary">
                      Rp {service.cost.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-theme-bg-secondary rounded-lg p-6">
            <h2 className="text-xl font-bold text-theme-text-base mb-4">
              Metode Pembayaran
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {PAYMENT_METHODS.map((method) => (
                <div
                  key={method}
                  onClick={() => setSelectedPayment(method)}
                  className={`border rounded-lg p-4 cursor-pointer transition text-center ${
                    selectedPayment === method
                      ? "border-theme-primary bg-theme-primary/10"
                      : "border-theme-border hover:border-theme-primary/50"
                  }`}
                >
                  <p className="font-semibold text-theme-text-base text-sm">
                    {method}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Summary */}
        <div className="lg:col-span-1">
          <div className="bg-theme-bg-secondary rounded-lg p-6 sticky top-4">
            <h2 className="text-xl font-bold text-theme-text-base mb-4">
              Ringkasan Pesanan
            </h2>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-theme-text-muted">
                <span>Subtotal Produk:</span>
                <span>Rp {itemsPrice.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between text-theme-text-muted">
                <span>Ongkos Kirim:</span>
                <span>
                  {selectedShipping
                    ? `Rp ${selectedShipping.cost.toLocaleString("id-ID")}`
                    : "Pilih pengiriman"}
                </span>
              </div>
              <div className="border-t border-theme-border pt-3 flex justify-between text-lg font-bold text-theme-text-base">
                <span>Total:</span>
                <span className="text-theme-primary">
                  Rp {totalPrice.toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-md text-red-500 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleCreateOrder}
              disabled={loading}
              className="w-full bg-theme-primary hover:bg-theme-primary-hover text-white font-bold py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Memproses..." : "Buat Pesanan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
