const nodemailer = require("nodemailer");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const sendResetEmail = async (req, res) => {
    const { email } = req.body;
    const current_user = req.current_user;
    const passwordResetLink = `${process.env.CLIENT_URL}/password-reset-link/${current_user._id}`;

    try {
        // Validate that the email received is the actual valid user email
        if (current_user.email !== email) {
            return res.status(400).json({
                error: true,
                message: "Wrong email! kindly enter your email for this account"
            });
        }

        // Setup nodemailer transporter to send reset password link to the user's email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_ACCT,
                pass: process.env.GMAIL_PASS
            }
        });

        // Setup the email options
        const mailOptions = {
            from: process.env.GMAIL_ACCT,
            to: email,
            subject: "Password Reset Link, TaskPilot",
            text: `Click the link to reset your password: ${passwordResetLink}`
        };

        // Send reset email
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log("Failed to send password reset link", err);
                return res.status(500).json({
                    error: true,
                    message: `Error sending password reset link to ${email}, kindly try again`
                });
            } else {
                console.log("Email successfully sent", info.response);
                return res.status(200).json({
                    status: "success",
                    message: "Reset password link has been sent to your email"
                });
            }
        });

    } catch (error) {
        console.error(`Error sending email to ${email}: ${error}`);
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        });
    }
};

const resetPassword = async (req, res) => {};

module.exports = { sendResetEmail, resetPassword };