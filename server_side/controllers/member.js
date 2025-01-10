const User = require("../models/user");
const Board = require("../models/board");
const Member = require("../models/member");

exports.getBoardMembers = async (req, res) => {
    // Returns an array of members for a particular board
    const boardId = req.params.boardId;

    try {
        // Check if board exists
        const board = await Board.findById(boardId);
        if (!board) {
            return res.status(404).json({
                error: true,
                message: "Board does not exist"
            });
        }

        // Return all members data for that board and populate the actual user data
        const members = await Member.find({
            board: boardId
        }).populate("user");

        // Return a response to the client
        return response.status(200).json(members);

    } catch (error) {
        console.log("Error retrieving members data:", error.message);
        return res.status(500).json({
            error: true,
            message: `Error: ${error.message}`
        });
    }
}