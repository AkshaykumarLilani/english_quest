const asyncHandler = require("express-async-handler");
const { USER_ROLES } = require("../config/enums");
const logger = require("../config/winston.logger");

const isCreator = asyncHandler(async (req, res, next) => {

    if (!req.user) {
        res.status(403);
        throw new Error("You are unauthorized or Token is expired");
    }

    const userRoles = req.user.role;
    let isThisUserACreator = false;
    if (Array.isArray(userRoles) && userRoles.length > 0) {
        isThisUserACreator = userRoles.filter(r => r === USER_ROLES.CREATOR).length > 0;
    }
    
    logger.info({ isCreator: req.user, isThisUserACreator });

    if (!isThisUserACreator){
        res.status(403);
        throw new Error("You are unauthorized to perform this action.");
    } else {
        next();
    }
})

module.exports = isCreator;