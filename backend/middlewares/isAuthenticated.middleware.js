const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const logger = require("../config/winston.logger");

const isAuthenticated = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader.includes("Bearer ")) {
        res.status(403);
        throw new Error("You are unauthorized to access this, please login first");
    }
    const token = authHeader.split("Bearer ")[1];
    logger.info({ token });
    if (!token) {
        res.status(403);
        throw new Error("You are unauthorized to access this, please login first");
    }

    const validateToken = jwt.verify(token, process.env.JWT_SECRET);
    logger.info({ validateToken });

    if (!validateToken.user) {
        res.status(403);
        throw new Error("You are unauthorized or Token is expired");
    }

    req.user = validateToken.user;
    next();
})

module.exports = isAuthenticated;