// User management

const User = require("../models/user");

exports.getUser = async (req, res) => {
    // Returns the user data
    const current_user = req.current_user;
    return res.status(200).json(current_user);
}

exports.updateUser = async (req, res) => {
    // Updates a user data
    try {
        const data = req.body;
        const user = req.current_user;
        
        // Check that the new email and username are unique
        if (user.email !== data.email) {
            const isExists = await User.findOne({email: data.email});
            if (isExists) {
                return res.status(409).json({
                    error: true,
                    message: "User with this email already exists"
                });
            }
        }

        // Update the user data
        Object.keys(data).forEach(key => {
            user[key] = data[key];
        });

        user.updatedAt = Date.now();
        await user.save();

        return res.status(200).json(user);

    } catch (err) {
        console.error(`${err}`);
        return res.status(500).json({Error: err.message});
    }
}