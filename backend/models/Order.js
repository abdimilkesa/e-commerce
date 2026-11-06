const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // Link order to registered customer
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },

    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      region: { type: String, required: true },
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        size: { type: String, required: true },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
    },

    shippingFee: {
      type: Number,
      required: true,
      default: 10,
    },
    paymentMethod: {
      type: String,
      enum: ["chapa", "telebirr", "bank"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    orderStatus: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
