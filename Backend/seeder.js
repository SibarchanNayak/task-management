import mongoose from "mongoose";
import connectDB from "./config/db.js";
import User from "./src/models/User.js";
import bcrypt from "bcrypt";

const adminUser = {
  name: "Admin",
  email: "admin@gmail.com",
  password: "admin",
  role: "admin",
};

async function seedAdmin() {
  try {
    await connectDB();
    const existingAdmin = await User.findOne({ email: adminUser.email });
    if (existingAdmin) {
      console.log("Admin user already exists!");
    } else {
      const hashedPassword = await bcrypt.hash(adminUser.password, 10);
      const newAdmin = new User({
        ...adminUser,
        password: hashedPassword,
      });
      await newAdmin.save();
      console.log("Admin user created successfully");
    }
    console.log("Database seeding completed");
  } catch (error) {
    console.error("Error seeding the database:", error);
  } finally {
    mongoose.connection.close();
  }
}

seedAdmin();
