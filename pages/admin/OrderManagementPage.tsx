import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { Order } from "../../types";

const STATUS_LABELS = {
  pending: { label: "Menunggu Konfirmasi", color: "bg-yellow-500" },
  confirmed: { label: "Dikonfirmasi", color: "bg-blue-500" },
  shipped: { label: "Dikirim", color: "bg-purple-500" },
  completed: { label: "Selesai", color: "bg-green-500" },
  cancelled: { label: "Dibatalkan", color: "bg-red-500" },
};

const STATUS_OPTIONS = [
  { value: "all", label: "Semua Status" },
  { value: "pending", label: "Menunggu Konfirmasi" },
  { value: "confirmed", label: "Dikonfirmasi" },
  { value: "shipped", label: "Dikirim" },
  { value: "completed", label: "Selesai" },
  { value: "cancelled", label: "Dibatalkan" },
];

const OrderManagementPage: React.FC = () => {
  const authContext = useContext(AuthContext);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updateStatusModal, setUpdateStatusModal] = useState<Order | null>(
    null
  );
  const [newStatus, setNewStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [updating, setUpdating] = useState(false);

  if (!authContext) {
    throw new Error("OrderManagementPage must be used within AuthProvider");
  }

  const { user } = authContext;

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const url = `http://localhost:5000/api/orders/admin/all?status=${filterStatus}`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!updateStatusModal || !newStatus) {
      alert("Pilih status baru");
      return;
    }

    try {
      setUpdating(true);
      const response = await fetch(
        `http://localhost:5000/api/orders/${updateStatusModal._id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify({ status: newStatus, note: statusNote }),
        }
      );

      if (response.ok) {
        alert("Status berhasil diupdate");
        fetchOrders();
        setUpdateStatusModal(null);
        setNewStatus("");
        setStatusNote("");
      } else {
        const error = await response.json();
        alert(error.message || "Gagal update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Terjadi kesalahan saat update status");
    } finally {
      setUpdating(false);
    }
  };

  const openUpdateModal = (order: Order) => {
    setUpdateStatusModal(order);
    setNewStatus(order.status);
    setStatusNote("");
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-center text-theme-text-muted">Loading orders...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-theme-text-base">
          Manajemen Pesanan
        </h1>
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-theme-bg-tertiary border border-theme-border rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-theme-primary"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-theme-bg-secondary rounded-lg p-12 text-center">
          <p className="text-theme-text-muted">Tidak ada pesanan</p>
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
                    Customer: {(order.user as any).name || "N/A"}
                  </p>
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
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${
                      STATUS_LABELS[order.status].color
                    }`}
                  >
                    {STATUS_LABELS[order.status].label}
                  </span>
                  {order.status !== "completed" &&
                    order.status !== "cancelled" && (
                      <button
                        onClick={() => openUpdateModal(order)}
                        className="bg-theme-primary hover:bg-theme-primary-hover text-white text-sm font-bold py-1 px-3 rounded-lg transition"
                      >
                        Update Status
                      </button>
                    )}
                  <button
                    onClick={() =>
                      setSelectedOrder(
                        selectedOrder?._id === order._id ? null : order
                      )
                    }
                    className="text-theme-primary hover:underline text-sm font-medium"
                  >
                    {selectedOrder?._id === order._id ? "Tutup" : "Detail"}
                  </button>
                </div>
              </div>

              {/* Order Items Summary */}
              <div className="mb-4">
                <p className="text-sm text-theme-text-muted mb-2">
                  {order.items.length} item • Total: Rp{" "}
                  {order.totalPrice.toLocaleString("id-ID")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {order.items.slice(0, 3).map((item, index) => (
                    <img
                      key={index}
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                  ))}
                  {order.items.length > 3 && (
                    <div className="w-12 h-12 bg-theme-bg-tertiary rounded-md flex items-center justify-center text-xs text-theme-text-muted">
                      +{order.items.length - 3}
                    </div>
                  )}
                </div>
              </div>

              {/* Detailed View */}
              {selectedOrder?._id === order._id && (
                <div className="pt-4 border-t border-theme-border space-y-4">
                  {/* Items */}
                  <div>
                    <h4 className="font-bold text-theme-text-base mb-2">
                      Detail Produk
                    </h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex gap-3 text-sm">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-theme-text-base">
                              {item.name}
                            </p>
                            <p className="text-theme-text-muted">
                              {item.brand} • Size {item.size} • Qty{" "}
                              {item.quantity}
                            </p>
                          </div>
                          <p className="font-bold text-theme-primary">
                            Rp{" "}
                            {(item.price * item.quantity).toLocaleString(
                              "id-ID"
                            )}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-bold text-theme-text-base mb-2">
                        Alamat Pengiriman
                      </h4>
                      <p className="text-sm text-theme-text-muted">
                        {order.shippingAddress.fullName}
                      </p>
                      <p className="text-sm text-theme-text-muted">
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
                    <div>
                      <h4 className="font-bold text-theme-text-base mb-2">
                        Info Pengiriman
                      </h4>
                      <p className="text-sm text-theme-text-muted">
                        {order.shippingService.name}
                      </p>
                      <p className="text-sm text-theme-text-muted">
                        Rp {order.shippingService.cost.toLocaleString("id-ID")}
                      </p>
                      <p className="text-sm text-theme-text-muted">
                        Estimasi: {order.shippingService.estimatedDays}
                      </p>
                      <p className="text-sm text-theme-text-muted mt-2">
                        <strong>Pembayaran:</strong> {order.paymentMethod}
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
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Update Status Modal */}
      {updateStatusModal && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center"
          onClick={() => setUpdateStatusModal(null)}
        >
          <div
            className="bg-theme-bg-primary rounded-xl shadow-2xl p-8 w-full max-w-md m-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-theme-text-base mb-6">
              Update Status Order
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-theme-text-muted mb-2">
                  Order Number
                </label>
                <p className="font-bold text-theme-text-base">
                  {updateStatusModal.orderNumber}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-theme-text-muted mb-2">
                  Status Baru
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-theme-bg-tertiary border border-theme-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-theme-primary"
                >
                  <option value="pending">Menunggu Konfirmasi</option>
                  <option value="confirmed">Konfirmasi</option>
                  <option value="shipped">Dikirim</option>
                  <option value="completed">Selesai</option>
                  <option value="cancelled">Batalkan</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-theme-text-muted mb-2">
                  Catatan (Opsional)
                </label>
                <textarea
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  rows={3}
                  className="w-full bg-theme-bg-tertiary border border-theme-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-theme-primary"
                  placeholder="Tambahkan catatan untuk update status ini..."
                />
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setUpdateStatusModal(null)}
                  className="px-5 py-2.5 text-sm font-medium text-theme-text-base bg-theme-bg-tertiary hover:bg-theme-border rounded-lg"
                >
                  Batal
                </button>
                <button
                  onClick={handleUpdateStatus}
                  disabled={updating}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-theme-primary hover:bg-theme-primary-hover rounded-lg disabled:opacity-50"
                >
                  {updating ? "Updating..." : "Update Status"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagementPage;
