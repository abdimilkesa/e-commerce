const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Order = require("../models/Order");
const authMiddleware = require("../middleware/authMiddleware");

// TEST-MODE PAYMENT SIMULATION (LOGIN REQUIRED)
router.post("/simulate", authMiddleware, async (req, res) => {
  try {
    // Allow simulation only in test mode
    if (process.env.PAYMENT_MODE !== "test") {
      return res.status(403).json({
        success: false,
        message: "Payment simulation is disabled.",
      });
    }

    const { orderId, outcome } = req.body;

    // Validate order ID
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID.",
      });
    }

    // Validate payment outcome
    if (!["success", "failed"].includes(outcome)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment outcome.",
      });
    }

    // Find only an order belonging to the logged-in user
    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found or access denied.",
      });
    }

    // Prevent processing an order twice
    if (order.paymentStatus !== "pending") {
      return res.status(400).json({
        success: false,
        message: "This order has already been processed.",
      });
    }

    // Update payment status
    order.paymentStatus = outcome === "success" ? "paid" : "failed";

    if (outcome === "success") {
      order.orderStatus = "processing";
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message:
        outcome === "success"
          ? "Test payment successful."
          : "Test payment failed.",
      order,
    });
  } catch (error) {
    console.error("Payment simulation error:", error);

    return res.status(500).json({
      success: false,
      message: "Payment processing failed.",
    });
  }
});

module.exports = router;
