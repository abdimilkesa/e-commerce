const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Product = require("../models/Product");
const authMiddleware = require("../middleware/authMiddleware");
const { adminMiddleware } = require("../middleware/authMiddleware");

// All routes below this middleware require an administrator
const adminOnly = [authMiddleware, adminMiddleware];

// GET ALL ACTIVE PRODUCTS (PUBLIC)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({ isActive: true });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// GET ALL PRODUCTS (ADMIN ONLY)
router.get("/admin/all", ...adminOnly, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// CREATE PRODUCT (ADMIN ONLY)
router.post("/", ...adminOnly, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      image,
      category,
      sizes,
      stock,
      isActive,
      subCategory,
      bestseller,
      currency,
    } = req.body;

    if (!name?.trim() || price === undefined || !category?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name, price, and category are required.",
      });
    }

    if (sizes !== undefined && !Array.isArray(sizes)) {
      return res.status(400).json({
        success: false,
        message: "Sizes must be an array.",
      });
    }

    const product = await Product.create({
      name: name.trim(),
      description,
      price,
      image,
      category: category.trim(),
      sizes,
      stock,
      isActive,
      subCategory,
      bestseller,
      currency,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully.",
      product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// UPDATE PRODUCT (ADMIN ONLY)
router.put("/:id", ...adminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    const allowedFields = [
      "name",
      "description",
      "price",
      "image",
      "category",
      "sizes",
      "stock",
      "isActive",
      "subCategory",
      "bestseller",
      "currency",
    ];

    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update.",
      });
    }

    if (updates.name !== undefined && typeof updates.name === "string") {
      updates.name = updates.name.trim();
    }

    if (
      updates.category !== undefined &&
      typeof updates.category === "string"
    ) {
      updates.category = updates.category.trim();
    }

    if (updates.sizes !== undefined && !Array.isArray(updates.sizes)) {
      return res.status(400).json({
        success: false,
        message: "Sizes must be an array.",
      });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// DELETE PRODUCT (ADMIN ONLY)
// Soft delete: keeps old order references safe.
router.delete("/:id", ...adminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deactivated successfully.",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
