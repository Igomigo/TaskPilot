// Middleware that checks that a user is permitted to see a board
const Board = require("../models/board");

exports.permitUser = async (req, res, next) => {
    // checks if a user is permitted to access a board
    // this middleware will be used in the getBoardById routes 
    try {
        const boardId = req.params.boardId;
        const current_user = req.current_user;
        const userId = current_user._id
        const board = await Board.findOne({_id: boardId,
            $or: [
                {owner: current_user._id},
                {members: {$in: [current_user._id]}}
            ]
        });
        if (!board) {
            return res.status(403).json({message: "You do not have poermission to access this board"});
        }
        next();
    } catch (err) {
        return res.status(500).json({message: "Server error", error: err});
    }
}