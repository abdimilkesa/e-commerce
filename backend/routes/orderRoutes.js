const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const Product = require("../models/Product");

// Create a new order
router.post("/create", async (req, res) => {
  try {
    const { customer, shippingAddress, items, paymentMethod } = req.body;

    // Validate required information
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

    let totalAmount = 0;
    const orderItems = [];

    // Verify products and calculate prices using MongoDB
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

      totalAmount += product.price * item.quantity;

      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        size: item.size,
      });
    }

    // Save the order
    const order = await Order.create({
      customer,
      shippingAddress,
      items: orderItems,
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

module.exports = router;
