const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Order = require("../models/Order");
const Product = require("../models/Product");

const authMiddleware = require("../middleware/authMiddleware");
const { adminMiddleware } = require("../middleware/authMiddleware");

const SHIPPING_FEE = 10;

// CREATE A NEW ORDER (LOGIN REQUIRED)
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { customer, shippingAddress, items, paymentMethod } = req.body;

    if (
      !customer?.name ||
      !customer?.email ||
      !customer?.phone ||
      !shippingAddress?.address ||
      !shippingAddress?.city ||
      !shippingAddress?.region ||
      !Array.isArray(items) ||
      items.length === 0 ||
      !["chapa", "telebirr", "bank"].includes(paymentMethod)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid checkout information.",
      });
    }

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      if (
        !item.productId ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        !item.size
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid product information.",
        });
      }

      const product = await Product.findOne({
        _id: item.productId,
        isActive: true,
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "A product was not found.",
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${product.name} does not have enough stock.`,
        });
      }

      if (product.sizes.length > 0 && !product.sizes.includes(item.size)) {
        return res.status(400).json({
          success: false,
          message: `Invalid size for ${product.name}.`,
        });
      }

      subtotal += product.price * item.quantity;

      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        size: item.size,
      });
    }

    const shippingFee = SHIPPING_FEE;
    const totalAmount = subtotal + shippingFee;

    const order = await Order.create({
      user: req.user._id,
      customer,
      shippingAddress,
      items: orderItems,
      subtotal,
      shippingFee,
      totalAmount,
      paymentMethod,
      paymentStatus: "pending",
      orderStatus: "pending",
    });

    return res.status(201).json({
      success: true,
      message: "Order created successfully.",
      order,
    });
  } catch (error) {
    console.error("Order creation error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create order.",
    });
  }
});

// GET LOGGED-IN CUSTOMER'S ORDERS
router.get("/my-orders", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Fetching orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve your orders.",
    });
  }
});

// ADMIN: GET ALL CUSTOMER ORDERS
router.get("/admin/all", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const search = req.query.search?.trim();

    const filter = {};

    if (search) {
      const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      const searchConditions = [
        { "customer.name": { $regex: safeSearch, $options: "i" } },
        { "customer.email": { $regex: safeSearch, $options: "i" } },
      ];

      if (mongoose.isValidObjectId(search)) {
        searchConditions.push({ _id: search });
      }

      filter.$or = searchConditions;
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 }).limit(100);

    const totalOrders = await Order.countDocuments(filter);

    return res.status(200).json({
      success: true,
      count: orders.length,
      totalOrders,
      orders,
    });
  } catch (error) {
    console.error("Admin fetching orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve customer orders.",
    });
  }
});

// ADMIN: GET ALL ORDERS FOR A SPECIFIC CUSTOMER
router.get(
  "/admin/customer/:customerId",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { customerId } = req.params;

      if (!mongoose.isValidObjectId(customerId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid customer ID.",
        });
      }

      const orders = await Order.find({
        user: customerId,
      }).sort({ createdAt: -1 });

      const totalSpent = orders
        .filter((order) => order.paymentStatus === "paid")
        .reduce((total, order) => total + order.totalAmount, 0);

      return res.status(200).json({
        success: true,
        count: orders.length,
        totalSpent,
        orders,
      });
    } catch (error) {
      console.error("Customer order history error:", error);

      return res.status(500).json({
        success: false,
        message: "Unable to retrieve customer order history.",
      });
    }
  }
);

// ADMIN: UPDATE ORDER STATUS
router.patch(
  "/admin/:orderId/status",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { orderId } = req.params;
      const { orderStatus } = req.body;

      const allowedStatuses = [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ];

      if (!mongoose.isValidObjectId(orderId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid order ID.",
        });
      }

      if (!allowedStatuses.includes(orderStatus)) {
        return res.status(400).json({
          success: false,
          message: "Invalid order status.",
        });
      }

      const order = await Order.findByIdAndUpdate(
        orderId,
        { orderStatus },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Order status updated successfully.",
        order,
      });
    } catch (error) {
      console.error("Order status update error:", error);

      return res.status(500).json({
        success: false,
        message: "Unable to update order status.",
      });
    }
  }
);

module.exports = router;
