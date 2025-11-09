const express = require("express");
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  getOrderStats,
} = require("../controllers/orderController");
const { protect, admin } = require("../middleware/authMiddleware");

// User routes (specific routes first!)
router.post("/", protect, createOrder);
router.get("/myorders", protect, getUserOrders);
router.put("/:id/cancel", protect, cancelOrder);

// Admin routes (general routes after specific ones)
router.get("/admin/all", protect, admin, getAllOrders);
router.get("/admin/stats", protect, admin, getOrderStats);
router.put("/:id/status", protect, admin, updateOrderStatus);

// This should be last - matches any order by ID
router.get("/:id", protect, getOrderById);

module.exports = router;
