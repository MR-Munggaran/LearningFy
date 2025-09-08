import jwt from "jsonwebtoken";
import { UserModel } from "../models/User.js";
import { ENV_VARS } from "../config/envVars.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies["learning_token"];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No Token Provided",
      });
    }

    // verify token
    const decoded = jwt.verify(token, ENV_VARS.JWT_SECRET);

    if (!decoded || !decoded.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Invalid Token",
      });
    }

    // ambil user dari database
    const user = await UserModel.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // jangan kirim password ke request
    delete user.password;

    req.user = user;

    next();
  } catch (error) {
    console.error("Error in ProtectRoute middleware:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Forbidden - Admin only",
    });
  }
};

export const authorizeInstructor = (req, res, next) => {
  if (req.user && req.user.role === "instructor") {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Forbidden - Instructor only", // perbaikan pesan
    });
  }
};
