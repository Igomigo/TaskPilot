const Notification = require("../models/notification");

exports.fetchNotifications = async (req, res) => {
    const { userId } = req.body
    const current_user = req.current_user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    try {
        // Determine the offset
        const offset = (page - 1) * limit;

        // Validate the user id
        if (!current_user._id.equals(userId)) {
            return res.status(403).json({
                error: true,
                message: "Forbidden: user ID doesn't correspond"
            });
        }

        // Fetch all notifications with pagination
        const notifications = await Notification.find({ userId })
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit);

        // Determine if it has more data
        const total = await Notification.countDocuments();
        const hasMore = offset + limit < total;

        // Return a response to the client
        return res.status(200).json({
            status: "success",
            notifications,
            hasMore
        });

    } catch (err) {
        console.error("An error occurred:", err);
        return res.status(500).json({
            error: true,
            message: `Error: ${err.message}`
        });
    }
};