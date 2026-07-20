import Admin from "../../models/admin/adminLogin.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateToken = (id, role) => {
  return jwt.sign(
    {
      id,
      role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};


// =====================
// ADMIN LOGIN
// =====================

export const loginAdmin = async (req, res) => {
  try {
    const username = req.body.username?.trim();
    const password = req.body.password;
console.log("get data");
    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password required",
      });
    }

    const admin = await Admin.findOne({
      username,
    });

    if (!admin) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }
console.log("data matched")
    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = generateToken(
      admin._id,
      "admin"
    );

    res.json({
      token,
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
