import jwt from "jsonwebtoken";
import AdminModel from "../models/adminModel.js";

/* admin login */
export async function adminLoginController(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and Password are required"
            });
        }

        const normalizedEmail = email.toLowerCase();
        const user = await AdminModel
            .findOne({ email: normalizedEmail })
            .select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Email or Password is invalid"
            });
        }

        const isValidPassword = await user.comparePassword(password);

        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: "Email or Password is invalid"
            });
        }

        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: "3d" }
        );

        const isProduction = process.env.NODE_ENV === "production";

        res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction,
            // If frontend & backend are on completely different domains, use "none" in prod.
            // If they share a root domain (e.g. app.yoursite.com & api.yoursite.com), "lax" is perfect.
            sameSite: isProduction ? "none" : "lax", 
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
        });

    } catch (error) {
        console.error("Login Controller Error:", error); 
        return res.status(500).json({
            success: false,
            message: "An unexpected server error occurred during login." 
        });
    }
}

/* admin logout */
export async function adminLogoutController(req, res) {
    try {
        const isProduction = process.env.NODE_ENV === "production";

        // Must strictly match the configuration used during login to be wiped successfully
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
        console.error("Logout Controller Error:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected server error occurred during logout.",
        });
    }
}