import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("_id name email role");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; //  ROLE ALWAYS CORRECT

    console.log("Auth Middleware - User Role:", req.user.role);
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
