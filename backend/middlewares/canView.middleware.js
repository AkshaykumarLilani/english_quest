const asyncHandler = require("express-async-handler");
const { USER_ROLES } = require("../config/enums");
const logger = require("../config/winston.logger");

const canView = asyncHandler(async (req, res, next) => {

    if (!req.user) {
        res.status(403);
        throw new Error("You are unauthorized or Token is expired");
    }

    const userRoles = req.user.role;
    let hasViewPermission = false;
    if (Array.isArray(userRoles) && userRoles.length > 0) {
        hasViewPermission = userRoles.filter(r => (r === USER_ROLES.VIEWER || r === USER_ROLES.VIEW_ALL)).length > 0;
    }
    
    logger.info({ canView: req.user, hasViewPermission });

    if (!hasViewPermission){
        res.status(403);
        throw new Error("You are unauthorized to view books.");
    } else {
        next();
    }
})

module.exports = canView;