const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/authMiddleware");

const SHIPPING_FEE = 10;

// CREATE A NEW ORDER (LOGIN REQUIRED)
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { customer, shippingAddress, items, paymentMethod } = req.body;

    // Validate checkout information
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

    // Verify products and calculate prices
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

    // Calculate final amount on the backend
    const shippingFee = SHIPPING_FEE;
    const totalAmount = subtotal + shippingFee;

    // Save order with authenticated user's ID
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

module.exports = router;
