import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "Not Authorized. Please log in again." });
        }

        const token = authHeader.split(" ")[1]; // Extract token after "Bearer"
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = { id: decoded.id }; // Store in req.user instead of req.body
        next();

    } catch (error) {
        console.error("JWT Error:", error);
        return res.status(401).json({ success: false, message: "Invalid or expired token. Please log in again." });
    }
};

export default authUser;
