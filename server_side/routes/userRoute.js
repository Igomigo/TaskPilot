// User Route

const express = require("express");
const user = require("../controllers/user");
const { sendResetEmail, resetPassword } = require("../controllers/passwordReset");
const authWare = require("../middlewares/authWare");

const router = express.Router();

/**
 * GET request to retrieve user data
 * url: http://localhost:3000/u/account
 */
router.get("/account", authWare, user.getUser);

/**
 * PUT request to update user data
 * url: http://localhost:3000/u/update
 */
router.put("/update", authWare, user.updateUser);

/**
 * POST request to send password reset email
 * url: http://localhost:3000/u/send-reset-password-link
 */
router.post("/send-reset-password-link", sendResetEmail);

/**
 * POST request to reset password
 * url: http://localhost:3000/u/reset-password
 */
router.post("/reset-password", resetPassword);


module.exports = router;