/**
 * The authentication engine of the server
 */
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const emailJob = require("../jobs/emailVerificationJob");

async function hashpwd(pwd) {
    // Returns the hashed version of a password
    const hashed = await bcrypt.hash(pwd, 10);
    return hashed;
}

exports.register = async (req, res) => {
    // Registers a user to the server
    try {
        const {username, email, password, profile_pic} = req.body;
        if (!username) {
            return res.status(400).json({error: "Username missing"});
        }
        if (!email) {
            return res.status(400).json({error: "Email missing"});
        }
        if (!password) {
            return res.status(400).json({error: "Password missing"});
        }
        const exists = await User.findOne({
            $or: [
                {email: email},
                {username: username}
            ]
        });
        if (exists) {
            return res.status(409).json({error: "User already exists"});
        }
        // Hash the password before saving account to the database
        const hashedpwd = await hashpwd(password);
        const user = new User({
            username: username,
            email: email,
            password: hashedpwd,
            profile_pic
        });
        await user.save();
        console.log(`User with email ${email} successfully created`);
        // call the emailJob function set up a background email response porocess
        emailJob(email, username).then(() => {
            console.log("Verification email sent successfully");
            //user
        }).catch((err) => {
            console.log("Failed to send Verification email", err);
        });

        return res.status(201).json({
            status: "success",
            message: "user created successfully",
            data: user
        });
    } catch (err) {
        console.error(`${err}`);
        return res.status(500).json({error: err.message});
    }
}

exports.login = async (req, res) => {
    // Logs a user in
    try {
        const {email, password} = req.body;
        if (!email) {
            console.log("email not provided");
            return res.status(400).json({error: "email missing"});
        }
        if (!password) {
            console.log("Password not provided");
            return res.status(400).json({error: "password missing"});
        }
        const user = await User.findOne({email: email});
        if (!user) {
            return res.status(404).json({error: "user not found"});
        }
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({error: "invalid password"});
        }
        const token = jwt.sign(
            {userId: user._id}, process.env.JWT_SECRET, {expiresIn: "14d"});
        return res.status(200).json({
            status: "success",
            token: token,
            data: user,
            message: "You successfully signed in"
        });
    } catch (err) {
        console.error(`${err}`);
        res.status(500).json({error: err.message});
    }
}