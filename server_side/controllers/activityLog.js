// Manages activity logging

const Log = require("../models/activityLog");

exports.getAllActivities = async (req, res) => {
    // Retrieves all log activity for a user
    const current_user = req.current_user;
    let { page, limit } = req.query;

    try {
        // Convert query parameter to numbers and set defaults
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const offset = (page - 1) * limit;

        // Fetch the paginated data set
        const activityLog = await Log.find({ createdBy: current_user._id })
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit);

        // Count the number of documents to determine if there are more
        const totalLogs = await Log.countDocuments({ createdBy: current_user._id });

        const hasMore = (offset + limit) < totalLogs;

        // Return response to the client
        return res.status(200).json({
            activityLogs: activityLog,
            hasMore
        });

    } catch (err) {
        console.log(`${err}`);
        return res.status(500).json({error: `An error occurred: ${err.message}`});
    }
}

exports.getBoardActivities = async (req, res) => {
    // Retrieves all log activity at the board level
    try {
        const boardId = req.params.boardId;
        const logs = await Log.find({boardId: boardId});
        if (logs.length === 0) {
            return res.status(404).json({error: "No activity found"});
        }
        return res.status(200).json(logs);
    } catch (err) {
        console.log(`${err}`);
        return res.status(500).json({error: `An error occurred: ${err.message}`});
    }
}

exports.getCardActivities = async (req, res) => {
    // Retrieve all activities for a specific card
    try {
        const boardId = req.params.boardId;
        const cardId = req.params.cardId;
        const logs = await Log.find({boardId: boardId, cardId: cardId});
        if (logs.length === 0) {
            return res.status(404).json({error: "No activity found"});
        }
        return res.status(200).json(logs);
    } catch (err) {
        console.log(`${err}`);
        return res.status(500).json({error: `An error occurred: ${err.message}`});
    }
}