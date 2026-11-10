const express = require("express");
const router = express.Router();

const SystemSettings = require("../models/SystemSettings");
const authMiddleware = require("../middleware/authMiddleware");
const { adminMiddleware } = require("../middleware/authMiddleware");

// Only authenticated administrators can access these routes
router.use(authMiddleware, adminMiddleware);

// GET SYSTEM SETTINGS
router.get("/", async (req, res) => {
  try {
    let settings = await SystemSettings.findOne();

    // Create default settings if none exist
    if (!settings) {
      settings = await SystemSettings.create({});
    }

    return res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error("Get system settings error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve system settings.",
    });
  }
});

// UPDATE SYSTEM SETTINGS
router.put("/", async (req, res) => {
  try {
    const {
      storeName,
      storeLogo,
      storeEmail,
      storePhone,
      storeAddress,
      currency,
      maintenanceMode,
      emailNotifications,
      orderNotifications,
    } = req.body;

    if (!storeName?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Store name is required.",
      });
    }

    const settings = await SystemSettings.findOneAndUpdate(
      {},
      {
        $set: {
          storeName: storeName.trim(),
          storeLogo,
          storeEmail,
          storePhone,
          storeAddress,
          currency,
          maintenanceMode,
          emailNotifications,
          orderNotifications,
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "System settings updated successfully.",
      settings,
    });
  } catch (error) {
    console.error("Update system settings error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update system settings.",
    });
  }
});

module.exports = router;
