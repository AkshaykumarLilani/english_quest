const express = require('express');
const { signupController, loginController } = require('../controllers/auth.controller');
const route = express.Router();

route.post("/signup", signupController);
route.post("/login", loginController);

module.exports = route;