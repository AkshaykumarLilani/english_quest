const asyncHandler = require('express-async-handler');
const bcryptjs = require('bcryptjs');
const jwt = require("jsonwebtoken");
const { createUser, getUserByEmail } = require('../services/user.service');
const logger = require('../config/winston.logger');

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account with the provided email and password.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       description: User information for registration
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       '201':
 *         description: Successfully registered a new user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The user ID
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: The registered email
 *       '400':
 *         description: Bad request. Email and password are required, or the email is already registered.
 */
const signupController = asyncHandler(async (req, res, next) => {
    const body = req.body;
    if (!body.email || !body.password) {
        res.status(400);
        throw new Error("Email and password, both are required");
    }

    const alreadyRegisteredUser = await getUserByEmail(body.email);
    if (alreadyRegisteredUser) {
        res.status(400);
        throw new Error("This email is already registered");
    }

    const user = createUser(body);
    await user.save();
    const userToSend = user.toObject();
    delete userToSend.password;
    return res.status(201).json(userToSend);
})

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in to the application
 *     description: Logs in a user with the provided email and password, returning an authentication token.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       description: User credentials for login
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       '200':
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Authentication token for the logged-in user
 *                 user:
 *                   type: object
 *                   description: User information (excluding password)
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The user ID
 *                     email:
 *                       type: string
 *                       format: email
 *                       description: The user's email
 *       '400':
 *         description: Bad request. Email and password are required, or the email is not registered, or the password is incorrect.
 */
const loginController = asyncHandler(async (req, res, next) => {
    const body = req.body;
    if (!body.email || !body.password) {
        res.status(400);
        throw new Error("Email and password, both are required");
    }
    logger.info(body);

    const desiredUser = await getUserByEmail(body.email);

    if (!desiredUser) {
        res.status(400);
        throw new Error("This email is not registered, please sign up first.");
    }

    const passwordMatches = bcryptjs.compareSync(body.password, desiredUser.password);

    if (!passwordMatches) {
        res.status(400);
        throw new Error("Incorrect email or password");
    }

    const userObject = desiredUser.toObject();
    delete userObject.password;

    const token = jwt.sign({ user: userObject }, process.env.JWT_SECRET);

    const dataToSend = {
        token,
        user: userObject
    }

    return res.status(200).json(dataToSend);
})

module.exports = {
    signupController,
    loginController
}