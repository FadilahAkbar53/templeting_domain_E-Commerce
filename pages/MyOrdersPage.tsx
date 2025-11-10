import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Order } from "../types";

const STATUS_LABELS = {
  pending: { label: "Menunggu Konfirmasi", color: "bg-yellow-500" },
  confirmed: { label: "Dikonfirmasi", color: "bg-blue-500" },
  shipped: { label: "Dikirim", color: "bg-purple-500" },
  completed: { label: "Selesai", color: "bg-green-500" },
  cancelled: { label: "Dibatalkan", color: "bg-red-500" },
};

const MyOrdersPage: React.FC = () => {
  const authContext = useContext(AuthContext);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(
    null
  );

  if (!authContext) {
    throw new Error("MyOrdersPage must be used within AuthProvider");
  }

  const { user } = authContext;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "/api/orders/myorders",
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!cancelReason.trim()) {
      alert("Mohon berikan alasan pembatalan");
      return;
    }

    try {
      setCancellingOrderId(orderId);
      const response = await fetch(
        `/api/orders/${orderId}/cancel`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify({ reason: cancelReason }),
        }
      );

      if (response.ok) {
        alert("Pesanan berhasil dibatalkan");
        fetchOrders();
        setSelectedOrder(null);
        setCancelReason("");
      } else {
        const error = await response.json();
        alert(error.message || "Gagal membatalkan pesanan");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Terjadi kesalahan saat membatalkan pesanan");
    } finally {
      setCancellingOrderId(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-theme-text-muted">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-theme-text-base mb-8">
        Pesanan Saya
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-theme-text-muted mb-4">Belum ada pesanan</p>
          <a
            href="/"
            className="inline-block bg-theme-primary hover:bg-theme-primary-hover text-white font-bold py-2 px-6 rounded-lg transition"
          >
            Belanja Sekarang
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-theme-bg-secondary rounded-lg p-6 border border-theme-border"
            >
              {/* Order Header */}
              <div className="flex flex-wrap justify-between items-start gap-4 mb-4 pb-4 border-b border-theme-border">
                <div>
                  <h3 className="font-bold text-theme-text-base text-lg">
                    {order.orderNumber}
                  </h3>
                  <p className="text-sm text-theme-text-muted">
                    {new Date(order.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${
                      STATUS_LABELS[order.status].color
                    }`}
                  >
                    {STATUS_LABELS[order.status].label}
                  </span>
                  <button
                    onClick={() =>
                      setSelectedOrder(
                        selectedOrder?._id === order._id ? null : order
                      )
                    }
                    className="text-theme-primary hover:underline text-sm font-medium"
                  >
                    {selectedOrder?._id === order._id
                      ? "Tutup Detail"
                      : "Lihat Detail"}
                  </button>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3 mb-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-theme-text-base">
                        {item.name}
                      </h4>
                      <p className="text-sm text-theme-text-muted">
                        {item.brand} • Size {item.size} • Qty {item.quantity}
                      </p>
                    </div>
                    <p className="font-bold text-theme-primary">
                      Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                    </p>
                  </div>
                ))}
              </div>

              {/* Order Total */}
              <div className="flex justify-between items-center pt-4 border-t border-theme-border">
                <span className="text-theme-text-muted">Total Pesanan:</span>
                <span className="text-xl font-bold text-theme-primary">
                  Rp {order.totalPrice.toLocaleString("id-ID")}
                </span>
              </div>

              {/* Detail Order (Expandable) */}
              {selectedOrder?._id === order._id && (
                <div className="mt-6 pt-6 border-t border-theme-border space-y-4">
                  {/* Shipping Address */}
                  <div>
                    <h4 className="font-bold text-theme-text-base mb-2">
                      Alamat Pengiriman
                    </h4>
                    <p className="text-sm text-theme-text-muted">
                      {order.shippingAddress.fullName} •{" "}
                      {order.shippingAddress.phone}
                    </p>
                    <p className="text-sm text-theme-text-muted">
                      {order.shippingAddress.address}
                    </p>
                    <p className="text-sm text-theme-text-muted">
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.province}{" "}
                      {order.shippingAddress.postalCode}
                    </p>
                  </div>

                  {/* Shipping & Payment */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-bold text-theme-text-base mb-2">
                        Pengiriman
                      </h4>
                      <p className="text-sm text-theme-text-muted">
                        {order.shippingService.name}
                      </p>
                      <p className="text-sm text-theme-text-muted">
                        Rp {order.shippingService.cost.toLocaleString("id-ID")}{" "}
                        • Estimasi: {order.shippingService.estimatedDays}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-bold text-theme-text-base mb-2">
                        Pembayaran
                      </h4>
                      <p className="text-sm text-theme-text-muted">
                        {order.paymentMethod}
                      </p>
                    </div>
                  </div>

                  {/* Status History */}
                  <div>
                    <h4 className="font-bold text-theme-text-base mb-2">
                      Riwayat Status
                    </h4>
                    <div className="space-y-2">
                      {order.statusHistory.map((history, index) => (
                        <div key={index} className="flex gap-3 text-sm">
                          <div
                            className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                              STATUS_LABELS[
                                history.status as keyof typeof STATUS_LABELS
                              ]?.color || "bg-gray-500"
                            }`}
                          />
                          <div className="flex-1">
                            <p className="text-theme-text-base font-medium">
                              {STATUS_LABELS[
                                history.status as keyof typeof STATUS_LABELS
                              ]?.label || history.status}
                            </p>
                            <p className="text-theme-text-muted">
                              {history.note}
                            </p>
                            <p className="text-theme-text-muted text-xs">
                              {new Date(history.updatedAt).toLocaleString(
                                "id-ID"
                              )}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cancel Order Button */}
                  {(order.status === "pending" ||
                    order.status === "confirmed") && (
                    <div className="pt-4">
                      <textarea
                        placeholder="Alasan pembatalan (wajib diisi)"
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        className="w-full bg-theme-bg-tertiary border border-theme-border rounded-md px-3 py-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                        rows={2}
                      />
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        disabled={cancellingOrderId === order._id}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition disabled:opacity-50"
                      >
                        {cancellingOrderId === order._id
                          ? "Membatalkan..."
                          : "Batalkan Pesanan"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
