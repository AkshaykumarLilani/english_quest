const User = require('../models/user.model');

const createUser = (user) => {
    return User(user);
}

const getUserByEmail = (email) => {
    return User.findOne({email});
}

module.exports = {
    createUser,
    getUserByEmail
}