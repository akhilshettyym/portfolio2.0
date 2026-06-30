import jwt from "jsonwebtoken";
import AdminModel from "../models/adminModel.js";

/* admin login */
export async function adminLoginController(req, res) {

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "email and password are required"
            });
        }

        const normalizedEmail = email.toLowerCase();

        const user = await AdminModel
            .findOne({ email: normalizedEmail })
            .select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "email or password is invalid"
            });
        }

        const isValidPassword = await user.comparePassword(password);

        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: "email or password is invalid"
            });
        }

        const token = jwt.sign({
            userId: user._id,
            role: user.role,
        },
            process.env.JWT_SECRET,
            { expiresIn: "3d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 3 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error during login",
            error: error.message
        });
    }
};


/* admin logout */
export async function adminLogoutController(req, res) {
    try {
        const isProduction = process.env.NODE_ENV === "production";

        res.clearCookie("token", {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
        });

        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error during logout",
            error: error.message,
        });
    }
};