// Contains middleware for authorizing users
const User = require("../models/user");
const jwt = require("jsonwebtoken");

async function authWare (req, res, next) {
    // Authorizes a user
    try {
        const token = req.headers["authorization"]?.split(" ")[1] ?? null;
        if (!token) {
            return res.status(401).json({Error: "unauthorized: token not provided"});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({Error: "unauthorized: Invalid token"});
        }
        req.current_user = user;
        next();
    } catch (err) {
        if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
            return res.status(401).json({Error: "unauthorized: invalid token"});
        }
        console.error(`${err}`);
        return res.status(500).json({Error: err.message});
    }
}

module.exports = authWare;