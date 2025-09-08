import bcryptjs from "bcryptjs";
import { UserModel } from "../models/User.js";
import { generateTokenAndSetCookie } from "../utils/generatesToken.js";

export const signup = async (req, res) => {
  try {
    const { email, password, role, name } = req.body;

    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    if (!["student", "instructor", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const existingUserByEmail = await UserModel.findByEmail(email);
    if (existingUserByEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = await UserModel.create({
      email,
      password: hashedPassword,
      role,
      name,
    });

    const token = generateTokenAndSetCookie(newUser.id, res);

    return res.status(201).json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcryptjs.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = generateTokenAndSetCookie(user.id, res);

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("learning_token");
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const profileMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in profileMe controller", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const detailProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (req.user.role !== "admin" && req.user.id !== parseInt(id)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in detailProfile controller", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const listUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Unauthorized" });
    }

    const users = await UserModel.findAll();

    res.status(200).json({ success: true, users });
  } catch (error) {
    console.log("Error in listUser controller", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    const fieldsToUpdate = {};

    if (name !== undefined) fieldsToUpdate.name = name;
    if (email !== undefined) fieldsToUpdate.email = email;
    if (role !== undefined) fieldsToUpdate.role = role;

    if (password) {
      const salt = await bcryptjs.genSalt(10);
      fieldsToUpdate.password = await bcryptjs.hash(password, salt);
    }

    const updated = await UserModel.update(id, fieldsToUpdate);

    if (!updated) {
      return res.status(404).json({ success: false, message: "User not found or no data updated" });
    }

    res.status(200).json({ success: true, user: updated });
  } catch (error) {
    console.error("Error in updateUser controller:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await UserModel.remove(id);
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.log("Error in deleteUser controller", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};