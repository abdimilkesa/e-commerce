const mongoose = require("mongoose");

const systemSettingsSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      default: "Gebeya",
      trim: true,
    },

    storeLogo: {
      type: String,
      default: "",
    },

    storeEmail: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },

    storePhone: {
      type: String,
      default: "",
      trim: true,
    },

    storeAddress: {
      type: String,
      default: "",
      trim: true,
    },

    currency: {
      type: String,
      enum: ["USD", "ETB", "EUR", "GBP"],
      default: "USD",
    },

    maintenanceMode: {
      type: Boolean,
      default: false,
    },

    emailNotifications: {
      type: Boolean,
      default: true,
    },

    orderNotifications: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const SystemSettings = mongoose.model("SystemSettings", systemSettingsSchema);

module.exports = SystemSettings;
