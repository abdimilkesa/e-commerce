const express = require("express");
const router = express.Router();

const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const { adminMiddleware } = require("../middleware/authMiddleware");

// ADMIN ONLY: GET ALL CUSTOMERS
router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { search = "" } = req.query;

    const filter = {
      role: "customer",
    };

    if (search.trim()) {
      const searchRegex = new RegExp(
        search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i"
      );

      filter.$or = [{ name: searchRegex }, { email: searchRegex }];
    }

    const customers = await User.find(filter)
      .select("name email createdAt")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: customers.length,
      customers,
    });
  } catch (error) {
    console.error("Get customers error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve customers",
    });
  }
});

// ADMIN ONLY: GET CUSTOMER DETAILS
router.get("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const customer = await User.findOne({
      _id: req.params.id,
      role: "customer",
    }).select("name email createdAt");

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.status(200).json({
      success: true,
      customer,
    });
  } catch (error) {
    console.error("Get customer details error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid customer ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to retrieve customer details",
    });
  }
});

module.exports = router;
