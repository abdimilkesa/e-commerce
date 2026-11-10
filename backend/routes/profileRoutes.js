const express = require("express");
const router = express.Router();

const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const { adminMiddleware } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const path = require("path");
const fs = require("fs");

// All profile routes require an authenticated administrator
router.use(authMiddleware, adminMiddleware);
// Upload administrator profile picture
router.post("/upload-picture", (req, res) => {
  upload.single("profilePicture")(req, res, async (err) => {
    try {
      if (err) {
        return res.status(400).json({
          message: err.message,
        });
      }

      if (!req.file) {
        return res.status(400).json({
          message: "Please select an image.",
        });
      }

      const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;

      const user = await User.findByIdAndUpdate(
        req.user._id,
        { profilePicture: imageUrl },
        { new: true }
      ).select("-password");

      if (!user) {
        fs.unlinkSync(req.file.path);

        return res.status(404).json({
          message: "Administrator not found.",
        });
      }

      res.json({
        message: "Profile picture uploaded successfully.",
        profilePicture: user.profilePicture,
      });
    } catch (error) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      res.status(500).json({
        message: "Failed to upload profile picture.",
      });
    }
  });
});
// GET ADMIN PROFILE
router.get("/", async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Administrator not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profilePicture: user.profilePicture,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve profile.",
    });
  }
});

// UPDATE ADMIN PROFILE
router.put("/", async (req, res) => {
  try {
    const { name, email, phone, profilePicture } = req.body;

    if (!name?.trim() || !email?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
      _id: { $ne: req.user._id },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "This email is already in use.",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Administrator not found.",
      });
    }

    user.name = name.trim();
    user.email = normalizedEmail;
    user.phone = typeof phone === "string" ? phone.trim() : "";
    user.profilePicture =
      typeof profilePicture === "string" ? profilePicture.trim() : "";

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profilePicture: user.profilePicture,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update profile.",
    });
  }
});

// CHANGE ADMIN PASSWORD
router.put("/change-password", async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Please complete all password fields.",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must contain at least 8 characters.",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New passwords do not match.",
      });
    }

    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Administrator not found.",
      });
    }

    const isPasswordCorrect = await user.comparePassword(currentPassword);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    user.password = newPassword;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.error("Change password error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to change password.",
    });
  }
});

module.exports = router;
