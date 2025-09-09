const jwt = require("jsonwebtoken");
const adminModel = require("../models/admin");

const checkAuth = async (req, res, next) => {
  try {
    // Get token from cookie or Authorization header
    const token =
      (req.cookies && req.cookies.token) ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    if (!token) {
      return res.status(401).json({
        success: false,
        redirect: true,
        message: "Unauthorized user, please login!",
      });
    }

    const SECRET = process.env.JWT_SECRET || "pn1234";

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        redirect: true,
        message: "Invalid or expired token, please login again!",
      });
    }

    // Find user
    const userData = await adminModel.findById(decoded.id).select("-password");
    if (!userData) {
      return res.status(401).json({
        success: false,
        redirect: true,
        message: "User not found. Please login again!",
      });
    }

    // Attach user data
    req.udata = {
      _id: userData._id,
      name: userData.name,
      email: userData.email,
      role: userData.role || "user",
      image: userData.image || null,
    };

    // Optional: Only allow admin
    if (req.udata.role !== "admin") {
      return res.status(403).json({
        success: false,
        redirect: true,
        message: "Access denied: Admins only",
      });
    }

    next();
  } catch (error) {
    console.error("Auth Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Authentication failed due to server error",
    });
  }
};

module.exports = checkAuth;
