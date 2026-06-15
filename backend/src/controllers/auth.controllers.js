import User from "../models/User.js";
import OTP from "../models/OTP.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendOTP } from "../utils/mailer.js";

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email aur password daalo" });
    if (password.length < 6)
      return res.status(400).json({ message: "Password kam se kam 6 characters ka hona chahiye" });
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already exists" });
    const hash = await bcrypt.hash(password, 10);
    await User.create({ email, password: hash });
    res.json({ message: "User registered successfully" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// Step 1 — Password verify karo, OTP bhejo
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email aur password daalo" });
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Invalid email or password" });

    // OTP bhejo
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.deleteMany({ email, type: "login" });
    await OTP.create({ email, otp, type: "login" });
    await sendOTP(email, otp, "login");

    res.json({ message: "OTP sent to your email", requireOTP: true });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// Step 2 — OTP verify karo, token do
export const verifyLoginOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const record = await OTP.findOne({ email, otp, type: "login" });
    if (!record)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    await OTP.deleteMany({ email, type: "login" });

    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({ token });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Email not registered" });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.deleteMany({ email, type: "reset" });
    await OTP.create({ email, otp, type: "reset" });
    await sendOTP(email, otp, "reset");
    res.json({ message: "OTP sent to your email" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const record = await OTP.findOne({ email, otp, type: "reset" });
    if (!record)
      return res.status(400).json({ message: "Invalid or expired OTP" });
    res.json({ message: "OTP verified" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (newPassword.length < 6)
      return res.status(400).json({ message: "Password kam se kam 6 characters ka hona chahiye" });
    const record = await OTP.findOne({ email, otp, type: "reset" });
    if (!record)
      return res.status(400).json({ message: "Invalid or expired OTP" });
    const hash = await bcrypt.hash(newPassword, 10);
    await User.updateOne({ email }, { password: hash });
    await OTP.deleteMany({ email, type: "reset" });
    res.json({ message: "Password reset successfully" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};