const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    image: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      required: true,
    },

    sizes: {
      type: [String],
      default: [],
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    legacyId: {
      type: String,
      unique: true,
      sparse: true,
    },

    subCategory: {
      type: String,
      default: "",
    },

    bestseller: {
      type: Boolean,
      default: false,
    },

    currency: {
      type: String,
      default: "ETB",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
