const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const customerRoutes = require("./routes/customerRoutes");
const profileRoutes = require("./routes/profileRoutes");
const systemSettingsRoutes = require("./routes/systemSettingsRoutes");
const path = require("path");
const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/system-settings", systemSettingsRoutes);

// Home route
app.get("/", (req, res) => {
  res.send("E-commerce backend is running!");
});
// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
  }
};

startServer();
