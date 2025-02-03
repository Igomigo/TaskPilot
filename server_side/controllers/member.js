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

        console.log("Members Data:", members);
        console.log("members count:", members.length);

        // Return a response to the client
        return res.status(200).json(members);

    } catch (error) {
        console.log("Error retrieving members data:", error.message);
        return res.status(500).json({
            error: true,
            message: `Error: ${error.message}`
        });
    }
}

exports.removeMember = async (req, res) => {
    // Handles removing members from a board
    const { boardId, memberUserId } = req.params;
    const current_user = req.current_user;

    try {
        // Check that the board exists and is valid
        const board = await Board.findById(boardId);

        if (!board) {
            return res.status(404).json({
                error: true,
                message: "Board not found"
            });
        }

        // Check that the member is not the current_user
        if (current_user._id.toString() === memberUserId.toString()) {
            return res.status(403).json({
                error: true,
                message: "You are not permitted to remove yourself"
            });
        }

        // Check that the members exists and delete
        const deletedMember = await Member.findOneAndDelete({
            board: boardId,
            user: memberUserId
        });

        if (!deletedMember) {
            return res.status(404).json({
                error: true,
                message: "Member doesn't exist"
            });
        }

        // Find the index of that particular user on the board members array
        const memberIndex = board.members.findIndex(
            member => member._id.toString() === memberUserId.toString()
        );

        if (memberIndex === -1) {
            return res.status(404).json({
                error: true,
                message: "Cannot delete, not a member of the board"
            });
        }

        // Delete the user record from the boards
        board.members.splice(memberIndex, 1);
        await board.save();

        // Return a response back to the client
        return res.status(200).json({
            message: "User successfully removed from the board",
            memberId: deletedMember._id
        });

    } catch (error) {
        console.log("Error:", error.message);
        return res.status(500).json({
            error: true,
            message: `${error.message}`
        });
    }
}
