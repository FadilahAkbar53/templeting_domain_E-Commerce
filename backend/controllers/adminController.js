// backend/controllers/adminController.js
const User = require("../models/User");
const Product = require("../models/Product");

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    // Count totals
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalAdmins = await User.countDocuments({ role: "admin" });

    // Get recent users (last 5)
    const recentUsers = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(5);

    // Get products with wishlist count
    const users = await User.find().select("wishlist username");
    const wishlistCounts = {};

    users.forEach((user) => {
      user.wishlist.forEach((productId) => {
        const id = productId.toString();
        wishlistCounts[id] = (wishlistCounts[id] || 0) + 1;
      });
    });

    // Get top 5 wishlisted products
    const topWishlisted = await Product.find().then((products) => {
      return products
        .map((product) => ({
          ...product.toObject(),
          wishlistCount: wishlistCounts[product._id.toString()] || 0,
        }))
        .sort((a, b) => b.wishlistCount - a.wishlistCount)
        .slice(0, 5);
    });

    res.json({
      totalProducts,
      totalUsers,
      totalAdmins,
      recentUsers,
      topWishlisted,
      totalWishlists: Object.values(wishlistCounts).reduce((a, b) => a + b, 0),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("wishlist");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent changing own role
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot change your own role" });
    }

    user.role = role;
    await user.save();

    res.json({ message: "User role updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent deleting own account
    if (user._id.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "Cannot delete your own account" });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get recent activity
// @route   GET /api/admin/activity
// @access  Private/Admin
const getRecentActivity = async (req, res) => {
  try {
    // Get recent users with their wishlist count
    const recentUsers = await User.find()
      .select("username role createdAt wishlist")
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("wishlist", "name");

    const activities = recentUsers.map((user) => ({
      type: "user_registered",
      user: user.username,
      role: user.role,
      timestamp: user.createdAt,
      details: `New ${user.role} registered`,
    }));

    res.json(activities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getRecentActivity,
};
