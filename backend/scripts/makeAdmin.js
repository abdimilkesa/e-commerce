require("dotenv").config();

const mongoose = require("mongoose");
const User = require("../models/User");

const makeAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = process.argv[2]?.trim().toLowerCase();

    if (!email) {
      console.log("Please provide an existing user's email.");
      process.exitCode = 1;
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found. Register the account first.");
      process.exitCode = 1;
      return;
    }

    if (user.role === "admin") {
      console.log("This account is already an administrator.");
      return;
    }

    user.role = "admin";
    await user.save();

    console.log("Administrator role assigned successfully.");
    console.log("Account:", user.email);
    console.log("Role:", user.role);
  } catch (error) {
    console.error("Admin setup error:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

makeAdmin();
