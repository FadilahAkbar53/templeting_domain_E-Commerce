// backend/index.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors()); // Mengizinkan permintaan dari domain lain (frontend Anda)
app.use(express.json()); // Mem-parsing body request JSON

// Request logging middleware (with sensitive data masking)
app.use((req, res, next) => {
  console.log(`\n📥 ${req.method} ${req.url}`);
  console.log(
    "Headers:",
    req.headers.authorization ? "Bearer token present" : "No token"
  );
  
  if (req.method === "POST" || req.method === "PUT") {
    // Mask sensitive fields
    const sanitizedBody = { ...req.body };
    const sensitiveFields = ['password', 'confirmPassword', 'token', 'apiKey', 'secret'];
    
    sensitiveFields.forEach(field => {
      if (sanitizedBody[field]) {
        sanitizedBody[field] = '***HIDDEN***';
      }
    });
    
    console.log("Body:", JSON.stringify(sanitizedBody, null, 2));
  }
  next();
});

// Koneksi ke Database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(err.message);
    process.exit(1); // Keluar dari proses jika gagal terhubung
  }
};

connectDB();

// Route sederhana untuk tes
app.get("/", (req, res) => {
  res.send("API is running...");
});

const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);

const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

const wishlistRoutes = require("./routes/wishlistRoutes");
app.use("/api/wishlist", wishlistRoutes);

const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

const brandRoutes = require("./routes/brandRoutes");
app.use("/api/brands", brandRoutes);

const orderRoutes = require("./routes/orderRoutes");
app.use("/api/orders", orderRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
