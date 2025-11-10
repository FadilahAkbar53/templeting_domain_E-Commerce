// backend/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log("🔐 Token received:", token.substring(0, 20) + "...");

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("✅ Token verified for user ID:", decoded.id);

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        console.log("❌ User not found in database");
        return res.status(401).json({ message: "User not found" });
      }

      console.log("✅ User authenticated:", req.user.username);
      next();
    } catch (error) {
      console.error("❌ Token verification failed:", error.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    console.log("❌ No token provided");
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as an admin" });
  }
};

module.exports = { protect, admin };
