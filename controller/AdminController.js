const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const adminModel = require("../models/admin");

const SECRET = process.env.JWT_SECRET || "pn1234"; // Secure secret key

class AdminController {
    // ================= REGISTER =================
    static register = async (req, res) => {
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                return res.status(400).json({ success: false, message: "All fields are required!" });
            }

            const existingUser = await adminModel.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ success: false, message: "Email already exists" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newAdmin = await adminModel.create({
                name,
                email,
                password: hashedPassword,
                role: "user",
            });

            return res.status(201).json({
                success: true,
                message: "Admin registered successfully",
                data: { _id: newAdmin._id, name: newAdmin.name, email: newAdmin.email },
            });
        } catch (error) {
            console.error("Register error:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    };

    // ================= LOGIN =================
    static login = async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ success: false, message: "Email and password are required" });
            }

            const admin = await adminModel.findOne({ email });
            if (!admin) {
                return res.status(401).json({ success: false, message: "Invalid email or password" });
            }

            const isMatch = await bcrypt.compare(password, admin.password);
            if (!isMatch) {
                return res.status(401).json({ success: false, message: "Invalid email or password" });
            }

            // Generate JWT token (use id not ID)
            const token = jwt.sign({ id: admin._id, role: admin.role }, SECRET, { expiresIn: "1d" });

            // Store token in cookie
            res.cookie("token", token, {
                httpOnly: true,
                secure: true,    // HTTPS required
                sameSite: "None", // cross-site cookie
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            return res.status(200).json({
                success: true,
                message: "Login successful",
                user: { _id: admin._id, name: admin.name, email: admin.email, role: admin.role },
            });
        } catch (error) {
            console.error("Login error:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    };

    // ================= CHANGE PASSWORD =================
    static changePassword = async (req, res) => {
        try {
            const { id } = req.params;
            const { oP, nP } = req.body;

            if (!oP || !nP) {
                return res.status(400).json({ success: false, message: "Old and new passwords are required" });
            }

            const admin = await adminModel.findById(id);
            if (!admin) {
                return res.status(404).json({ success: false, message: "Admin not found" });
            }

            const isMatch = await bcrypt.compare(oP, admin.password);
            if (!isMatch) {
                return res.status(400).json({ success: false, message: "Old password is incorrect" });
            }

            const hashedPassword = await bcrypt.hash(nP, 10);
            admin.password = hashedPassword;
            await admin.save();

            return res.status(200).json({ success: true, message: "Password changed successfully" });
        } catch (error) {
            console.error("Change password error:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    };

    // ================= LOGOUT =================
    static logOut = async (req, res) => {
        try {
            res.clearCookie("token");
            return res.status(200).json({ success: true, message: "Logged out successfully" });
        } catch (error) {
            console.error("Logout error:", error);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
    };

    // ================= DASHBOARD (Protected) =================
    static dashboard = async (req, res) => {
        try {
            return res.status(200).json({
                success: true,
                message: "Welcome to Admin Dashboard ✅",
                user: req.udata, // From checkAuth middleware
            });
        } catch (error) {
            console.error("Dashboard error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    };

    // ================= GET ALL USERS =================
    static getUsers = async (req, res) => {
        try {
            const users = await adminModel.find().select("-password");
            return res.status(200).json({
                success: true,
                data: users,
            });
        } catch (error) {
            console.error("Get users error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    };

    // ================= UPDATE PROFILE =================
    static updateProfile = async (req, res) => {
        try {
            const { id } = req.params;
            const { name, image } = req.body;

            if (!name && !image) {
                return res.status(400).json({
                    success: false,
                    message: "Nothing to update",
                });
            }

            const updatedData = { name };

            if (image?.public_id && image?.url) {
                updatedData.image = {
                    public_id: image.public_id,
                    url: image.url,
                };
            }

            const updatedAdmin = await adminModel
                .findByIdAndUpdate(id, updatedData, { new: true })
                .select("-password");

            if (!updatedAdmin) {
                return res.status(404).json({
                    success: false,
                    message: "Admin not found",
                });
            }

            return res.status(200).json({
                success: true,
                message: "Profile updated successfully",
                data: updatedAdmin,
            });
        } catch (error) {
            console.error("Update profile error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    };

    // ================= PROFILE (Protected) =================
    static profile = async (req, res) => {
        try {
            return res.status(200).json({
                success: true,
                message: "Admin profile fetched successfully",
                user: req.udata, // From checkAuth middleware
            });
        } catch (error) {
            console.error("Profile error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    };
}

module.exports = AdminController;
