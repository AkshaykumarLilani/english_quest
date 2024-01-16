const { Schema, model } = require("mongoose");
const bcryptjs = require('bcryptjs');
const { USER_ROLES } = require("../config/enums");

const userSchema = Schema({
    first_name: {
        type: String,
        required: false,
    },
    last_name: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email already exists"],
    },
    password: {
        type: String,
        required: [true, "password is required"],
    },
    role: {
        type: [String],
        default: [USER_ROLES.VIEW_ALL],
        enums: Object.keys(USER_ROLES)
    }
}, { timestamp: true });

userSchema.pre("save", function (next) {
    if (!this.password) {
        next();
    }
    let salt = bcryptjs.genSaltSync(10);
    let hashedPassword = bcryptjs.hashSync(this.password, salt);
    this.password = hashedPassword;
    next();
});

const User = model("user", userSchema);

module.exports = User