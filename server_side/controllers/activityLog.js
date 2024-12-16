// Manages activity logging

const Log = require("../models/activityLog");

exports.getAllActivities = async (req, res) => {
    // Retrieves all log activity for a user
    const current_user = req.current_user;

    console.log(current_user);

    try {
        console.log("Request git to activity log");
        const activityLog = await Log.find({ createdBy: current_user._id });

        console.log(activityLog);

        // Return response to the client
        return res.status(200).json(activityLog);

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