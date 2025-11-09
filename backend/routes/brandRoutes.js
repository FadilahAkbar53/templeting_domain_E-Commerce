// backend/routes/brandRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAllBrands,
  getAllBrandsAdmin,
  createBrand,
  updateBrand,
  deleteBrand,
} = require("../controllers/brandController");
const { protect, admin } = require("../middleware/authMiddleware");

// Public route - get active brands only
router.get("/", getAllBrands);

// Admin routes - require authentication and admin role
router.get("/admin", protect, admin, getAllBrandsAdmin);
router.post("/", protect, admin, createBrand);
router.put("/:id", protect, admin, updateBrand);
router.delete("/:id", protect, admin, deleteBrand);

module.exports = router;
