const jwt = require("jsonwebtoken");
const adminModel = require("../models/admin");

const checkAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        redirect: true,
        message: "Unauthorized user, please login!",
      });
    }

    const SECRET = process.env.JWT_SECRET || "pn1234";
    const decoded = jwt.verify(token, SECRET);

    const userData = await adminModel.findById(decoded.id).select("-password");
    if (!userData) {
      return res.status(401).json({
        success: false,
        redirect: true,
        message: "User not found. Please login again!",
      });
    }

    // Attach user data to request
    req.udata = {
      _id: userData._id,
      name: userData.name,
      email: userData.email,
      role: userData.role || "user",
      image: userData.image || null,
    };

    // ✅ Optional: Restrict access to admins only
    if (req.udata.role !== "admin") {
      return res.status(403).json({
        success: false,
        redirect: true,
        message: "Access denied: Admins only",
      });
    }

    next();
  } catch (error) {
    console.error("Auth Error:", error);
    return res.status(401).json({
      success: false,
      redirect: true,
      message: "Invalid or expired token, please login again!",
    });
  }
};

module.exports = checkAuth;
