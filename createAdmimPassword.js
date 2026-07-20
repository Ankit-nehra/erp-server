  import mongoose from "mongoose";
  import bcrypt from "bcryptjs";
  import dotenv from "dotenv";
  import Admin from "./models/admin.js"; // path to your admin model

  dotenv.config();

  const createAdminPassword = async () => {
    try {
      // Connect to MongoDB
      if (!process.env.MONGO_URI) throw new Error("MONGO_URI not defined in .env");
      await mongoose.connect(process.env.MONGO_URI);
      console.log("MongoDB connected");

      const username = "admin";       // desired admin username
      const password = "admin123";    // desired admin password

      // Check if admin already exists
      const existingAdmin = await Admin.findOne({ username });
      if (existingAdmin) {
        console.log("Admin user already exists!");
        process.exit(0);
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new admin
      const newAdmin = new Admin({
        username,
        password: hashedPassword
      });

      await newAdmin.save();
      console.log("Admin created successfully!");
      console.log(`Username: ${username}`);
      console.log(`Password: ${password} (use this to login)`);

      process.exit(0);
    } catch (err) {
      console.error("Error creating admin:", err.message);
      process.exit(1);
    }
  };

  createAdminPassword();