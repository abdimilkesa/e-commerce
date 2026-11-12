const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const User = require("../models/User");

// ========================================
// GMAIL SMTP TRANSPORTER
// ========================================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// ========================================
// GENERATE JWT TOKEN
// ========================================
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// ========================================
// REGISTER
// ========================================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please provide name, email, and password.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "An account with this email already exists.",
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: password,
      role: "customer",
    });
    const token = generateToken(user);

    return res.status(201).json({
      message: "Registration successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error.message);

    return res.status(500).json({
      message: "Registration failed. Please try again.",
    });
  }
});

// ========================================
// LOGIN
// ========================================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      message: "Login failed. Please try again.",
    });
  }
});

// ========================================
// VERIFY RESET LINK AND GET ACCOUNT EMAIL
// ========================================
router.get("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        message: "Invalid reset link.",
      });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    }).select("+resetPasswordToken +resetPasswordExpires");

    if (!user) {
      return res.status(400).json({
        message: "This reset link is invalid or has expired.",
      });
    }

    // Return the email associated with this valid reset link.
    return res.status(200).json({
      message: "Reset link verified successfully.",
      email: user.email,
    });
  } catch (error) {
    console.error("Reset link verification error:", error.message);

    return res.status(500).json({
      message: "Unable to verify this reset link.",
    });
  }
});

// ========================================
// FORGOT PASSWORD - SEND RESET LINK
// ========================================
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== "string") {
      return res.status(400).json({
        message: "Please provide a valid email address.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const genericMessage =
      "If an account exists with that email, a password reset link will be sent.";

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+resetPasswordToken +resetPasswordExpires");

    // Do not reveal whether an account exists.
    if (!user) {
      return res.status(200).json({
        message: genericMessage,
      });
    }

    // Generate a secure random token.
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Store only the token hash in MongoDB.
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Token expires in 30 minutes.
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000);

    await user.save();

    // Build the frontend reset URL.
    const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";

    const resetLink = new URL(
      `/reset-password/${resetToken}`,
      frontendURL
    ).toString();

    try {
      await transporter.sendMail({
        from: `"STYLE WAVE" <${process.env.GMAIL_USER}>`,
        to: normalizedEmail,
        subject: "STYLE WAVE - Reset Your Password",

        text: `
Hello ${user.name},

We received a request to reset your STYLE WAVE password.

Open this link to choose a new password:

${resetLink}

This link expires in 30 minutes.

If you did not request this, you can ignore this email.
        `,

        html: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 25px; border: 1px solid #eee; border-radius: 12px;">
            <h2 style="color: #f97316;">STYLE WAVE</h2>

            <h3>Password Reset</h3>

            <p>Hello ${user.name},</p>

            <p>We received a request to reset your STYLE WAVE password.</p>

            <p>Click the button below to create a new password:</p>

            <div style="margin: 30px 0;">
              <a
                href="${resetLink}"
                style="background: #f97316; color: white; padding: 14px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;"
              >
                Reset My Password
              </a>
            </div>

            <p>This link expires in <strong>30 minutes</strong>.</p>

            <p>If you did not request this, you can safely ignore this email.</p>

            <hr />

            <p style="color: #888; font-size: 12px;">
              STYLE WAVE Security Team
            </p>
          </div>
        `,
      });
    } catch (emailError) {
      // Remove the unused token if email delivery fails.
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      throw emailError;
    }

    return res.status(200).json({
      message: genericMessage,
    });
  } catch (error) {
    console.error("Forgot password error:", error.message);

    return res.status(500).json({
      message: "Unable to send the password reset email. Please try again.",
    });
  }
});

// ========================================
// RESET PASSWORD - SAVE NEW PASSWORD
// ========================================
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (!token || !password || !confirmPassword) {
      return res.status(400).json({
        message: "Please complete all fields.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match.",
      });
    }

    // Hash the token received from the reset link.
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find the user with a matching, unexpired token.
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    }).select("+resetPasswordToken +resetPasswordExpires");

    if (!user) {
      return res.status(400).json({
        message: "This password reset link is invalid or has expired.",
      });
    }

    // Hash and save the new password.
    user.password = password;
    // Make the reset link unusable again.
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.status(200).json({
      message: "Your password has been reset successfully. You can now log in.",
    });
  } catch (error) {
    console.error("Reset password error:", error.message);

    return res.status(500).json({
      message: "Password reset failed. Please try again.",
    });
  }
});

module.exports = router;
