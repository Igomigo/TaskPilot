const nodemailer = require("nodemailer");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const sendResetEmail = async (req, res) => {
    const { email } = req.body;
    const resetPasswordToken = uuidv4().toString();

    try {
        // Validate that the email received is the actual valid user email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                error: true,
                message: "User not found! kindly enter your email for this account"
            });
        }

        // Save the generated uuid token to the database
        user.resetPasswordToken = resetPasswordToken;
        await user.save();

        // Construct the reset password link url
        const passwordResetLink = `${process.env.CLIENT_URL}/reset-password/${resetPasswordToken}`;

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

const resetPassword = async (req, res) => {
    const { resetToken, password } = req.body;

    try {
        // Check that the actual user exists through the userId
        const user = await User.findOne({
            resetPasswordToken: resetToken
        });
        if (!user) {
            return res.status(404).json({
                error: true,
                message: "Invalid reset link, kindly use the latest link"
            });
        }

        // hash the new password
        const hashedPwd = await bcrypt.hash(password, 10);

        // Update the password field with the new hashed password
        user.password = hashedPwd;
        await user.save();

        // Return a response back to the client
        return res.status(200).json({
            status: "success",
            message: "Password reset operation successful"
        });

    } catch (error) {
        console.log("Error resetting password:", error);
        return res.status(500).json({
            error: true,
            message: "Password reset operation failed"
        });
    }
};

module.exports = { sendResetEmail, resetPassword };