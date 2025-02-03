const User = require("../models/user");
const Board = require("../models/board");
const Member = require("../models/member");
const ActivityLog = require("../models/activityLog");

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
        return res.status(200).json(members);

    } catch (error) {
        console.log("Error retrieving members data:", error.message);
        return res.status(500).json({
            error: true,
            message: `Error: ${error.message}`
        });
    }
}

exports.addMember = async (req, res) => {
    // Adds a member to the board.members field
    const boardId = req.params.boardId;
    const current_user = req.current_user;
    const { username } = req.body;

    try {
        const board = await Board.findById(boardId);

        if (!board) {
            console.log(`Board <${board.title}> not found`);
            return res.status(404).json({message: "Board not found"});
        }

        const user = await User.findOne({username: username});

        if (user && board.members.includes(user._id)) {
            console.log("Member already exists in the board");
            return res.status(409).json({
                message: "User already exists in the board"
            });
        }

        // Create the new board members document for that user
        const member = new Member({
            board: board._id,
            role: "member",
            user: user._id
        });
        await member.save();

        // add member to the board
        board.members.push(user._id);
        await board.save();

        // log the activity
        const logger = new ActivityLog({
            action: "Add member",
            entity: "Board",
            entityId: boardId,
            details: `${current_user.username} added ${username} to this board`,
            createdBy: current_user._id,
            boardId: boardId,
        });

        await logger.save();

        // Send a request for the member data and populate the user field
        const memberData = await Member.findById(member._id)
        .populate("user");

        // return a response to the client
        return res.status(200).json(memberData);

    } catch (err) {
        console.log(`${err}`);
        return res.status(500).json({
            error: `An internal error occured: ${err.message}`
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

        // Prevent the user from removing themselves
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

        // Delete the user record from the boards
        await Board.updateOne(
            { _id: boardId },
            { $pull: { members: memberUserId } }
        );

        // Return a success response back to the client
        return res.status(200).json({
            message: "User successfully removed from the board",
            memberId: deletedMember._id
        });

    } catch (error) {
        console.error("Error removing member:", error); // More helpful logging
        return res.status(500).json({
            error: true,
            message: "Internal server error"
        });
    }
}
