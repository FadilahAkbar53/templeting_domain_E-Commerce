const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (User)
const createOrder = async (req, res) => {
  try {
    console.log("📦 Creating order for user:", req.user.username);
    console.log("📦 Request body:", JSON.stringify(req.body, null, 2));

    const { items, shippingAddress, shippingService, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      console.log("❌ No order items");
      return res.status(400).json({ message: "No order items" });
    }

    // Validate all required fields
    if (!shippingAddress || !shippingService || !paymentMethod) {
      return res
        .status(400)
        .json({ message: "Missing required order information" });
    }

    // Calculate prices
    let itemsPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res
          .status(404)
          .json({ message: `Product not found: ${item.product}` });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        brand: product.brand,
        image: product.image,
        price: product.price,
        quantity: item.quantity,
        size: item.size,
      });

      itemsPrice += product.price * item.quantity;
    }

    const shippingPrice = shippingService.cost;
    const totalPrice = itemsPrice + shippingPrice;

    // Create order
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      shippingService,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      status: "pending",
    });

    // Clear user's cart after successful order
    await User.findByIdAndUpdate(req.user._id, { cart: [] });

    res.status(201).json(order);
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get user's orders
// @route   GET /api/orders/myorders
// @access  Private (User)
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product", "name brand")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Get user orders error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private (User/Admin)
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("items.product", "name brand");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if user owns the order or is admin
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this order" });
    }

    res.json(order);
  } catch (error) {
    console.error("Get order by ID error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private (Admin)
const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status && status !== "all") {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate("user", "name email")
      .populate("items.product", "name brand")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Order.countDocuments(query);

    res.json({
      orders,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalOrders: count,
    });
  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private (Admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;

    const validStatuses = [
      "pending",
      "confirmed",
      "shipped",
      "completed",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Prevent updating completed or cancelled orders
    if (order.status === "completed" || order.status === "cancelled") {
      return res.status(400).json({
        message: `Cannot update order that is already ${order.status}`,
      });
    }

    order.status = status;

    // Add to status history
    order.statusHistory.push({
      status,
      note: note || getStatusNote(status),
      updatedAt: new Date(),
    });

    await order.save();

    res.json(order);
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private (User/Admin)
const cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check authorization
    if (
      order.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to cancel this order" });
    }

    // Can only cancel pending or confirmed orders
    if (
      order.status === "shipped" ||
      order.status === "completed" ||
      order.status === "cancelled"
    ) {
      return res.status(400).json({
        message: `Cannot cancel order with status: ${order.status}`,
      });
    }

    order.status = "cancelled";
    order.cancelReason = reason || "Cancelled by user";

    order.statusHistory.push({
      status: "cancelled",
      note: reason || "Cancelled by user",
      updatedAt: new Date(),
    });

    await order.save();

    res.json(order);
  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get order statistics (Admin)
// @route   GET /api/orders/admin/stats
// @access  Private (Admin)
const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: "pending" });
    const confirmedOrders = await Order.countDocuments({ status: "confirmed" });
    const shippedOrders = await Order.countDocuments({ status: "shipped" });
    const completedOrders = await Order.countDocuments({ status: "completed" });
    const cancelledOrders = await Order.countDocuments({ status: "cancelled" });

    // Calculate total revenue from completed orders
    const revenueData = await Order.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

    // Recent orders
    const recentOrders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalOrders,
      pendingOrders,
      confirmedOrders,
      shippedOrders,
      completedOrders,
      cancelledOrders,
      totalRevenue,
      recentOrders,
    });
  } catch (error) {
    console.error("Get order stats error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Helper function to get status note
const getStatusNote = (status) => {
  const notes = {
    pending: "Menunggu konfirmasi",
    confirmed: "Pesanan dikonfirmasi oleh admin",
    shipped: "Pesanan sedang dikirim",
    completed: "Pesanan selesai",
    cancelled: "Pesanan dibatalkan",
  };
  return notes[status] || "Status updated";
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  getOrderStats,
};
