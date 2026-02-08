import jwt from "jsonwebtoken";

async function jwtAuth(req, res, next) {
    const token = req.header("Authorization");
    if (!token) {
        return res.status(401).json({ message: "Unauthorized or no token provided" });
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized or invalid token" });
    }
};

export default jwtAuth;
