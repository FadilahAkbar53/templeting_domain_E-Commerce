// backend/routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getRecentActivity,
} = require("../controllers/adminController");
const { protect, admin } = require("../middleware/authMiddleware");

// All routes require authentication AND admin role
router.use(protect);
router.use(admin);

// Dashboard & Statistics
router.get("/stats", getDashboardStats);
router.get("/activity", getRecentActivity);

// User Management
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

module.exports = router;
