require("dotenv").config();

const connectDB = require("./config/db");
const User = require("./models/User");
const readline = require("readline/promises");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function updateAdminCredentials() {
  try {
    await connectDB();

    const admin = await User.findOne({
      email: "bona@gmail.com",
      role: "admin",
    }).select("+password");

    if (!admin) {
      console.log("Admin account not found.");
      process.exitCode = 1;
      return;
    }

    const newEmail = (await rl.question("Enter your new admin email: "))
      .trim()
      .toLowerCase();

    const newPassword = await rl.question("Enter your new admin password: ");

    if (!newEmail.includes("@")) {
      console.log("Please enter a valid email.");
      process.exitCode = 1;
      return;
    }

    if (newPassword.length < 8) {
      console.log("Password must be at least 8 characters.");
      process.exitCode = 1;
      return;
    }

    const existingUser = await User.findOne({
      email: newEmail,
      _id: { $ne: admin._id },
    });

    if (existingUser) {
      console.log("This email is already registered.");
      process.exitCode = 1;
      return;
    }

    admin.email = newEmail;
    admin.password = newPassword;

    await admin.save();

    console.log("Admin email and password updated successfully!");
  } catch (error) {
    console.error("Update failed:", error.message);
    process.exitCode = 1;
  } finally {
    rl.close();
    process.exit();
  }
}

updateAdminCredentials();
