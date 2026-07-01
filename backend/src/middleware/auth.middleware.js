import jwt from "jsonwebtoken";

export const protectAdminRoute = async (req, res, next) => {

    try {
        let token = req.cookies.token;

        if (!token && req.headers.authorization?.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access Denied. No token provided."
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== "ADMIN") {
            return res.status(403).json({
                success: false,
                message: "Forbidden. Insufficient permissions."
            });
        }

        req.adminId = decoded.userId;
        next();
        
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Authentication failed. Invalid or expired token."
        });
    }
    
};