/**
 * The authentication engine of the server
 */
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function hashpwd(pwd) {
    // Returns the hashed version of a password
    const hashed = await bcrypt.hash(pwd, 10);
    return hashed;
}

exports.register = async (req, res) => {
    // Registers a user to the server
    try {
        const {username, email, password} = req.body;
        if (!username) {
            return res.status(400).json({Error: "Username missing"});
        }
        if (!email) {
            return res.status(400).json({Error: "Email missing"});
        }
        if (!password) {
            return res.status(400).json({Error: "Password missing"});
        }
        const exists = await User.findOne({email: email});
        if (exists) {
            return res.status(409).json({Error: "User already exists"});
        }
        // Hash the password before saving account to the database
        const hashedpwd = await hashpwd(password);
        const user = new User({
            username: username,
            email: email,
            password: hashedpwd
        });
        await user.save();
        console.log(`User with email ${email} successfully created`);
        return res.status(201).json({
            status: "success",
            message: "user created successfully",
            email: email
        });
    } catch (err) {
        console.error(`${err}`);
        return res.status(500).json({Error: err.message});
    }
}

exports.login = async (req, res) => {
    // Logs a user in
    try {
        const {email, password} = req.body;
        if (!email) {
            return res.status(400).json({Error: "email missing"});
        }
        if (!password) {
            return res.status(400).json({Error: "password missing"});
        }
        const user = await User.findOne({email: email});
        if (!user) {
            return res.status(404).json({Error: "user not found"});
        }
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({Error: "invalid password"});
        }
        const token = jwt.sign(
            {userId: user._id}, process.env.JWT_SECRET, {expiresIn: "14d"});
        return res.status(200).json({
            token: token
        });
    } catch (err) {
        console.error(`${err}`);
        res.status(500).json({Error: err.message});
    }
}