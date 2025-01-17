// Middlewares that inject strict permission measures on the board
const Board = require("../models/board");

exports.permitUser = async (req, res, next) => {
    // checks if a user is permitted to access a board
    // this middleware will be used in the getBoardById routes 
    try {
        const boardId = req.params.boardId;
        const current_user = req.current_user;
        const board = await Board.findOne({_id: boardId,
            $or: [
                {owner: current_user._id},
                {members: {$in: [current_user._id]}}
            ]
        });
        if (!board) {
            return res.status(403).json({message: "You do not have permission to access this board"});
        }
        next();
    } catch (err) {
        return res.status(500).json({message: "Server error", error: err});
    }
}

exports.addRemDelPermission = async (req, res, next) => {
    try {
        const boardId = req.params.boardId;
        //console.log(`Attempting to verify permissions for board: ${boardId}`);

        if (!boardId || typeof boardId !== 'string' || boardId.length !== 24) {
            //console.log(`Invalid boardId: ${boardId}`);
            return res.status(400).json({ message: "Invalid board ID" });
        }

        const current_user = req.current_user;
        //console.log(`Current user: ${current_user._id}`);

        const board = await Board.findById(boardId);
        
        if (!board) {
            //console.log(`Board not found: ${boardId}`);
            return res.status(404).json({ message: "Board not found" });
        }
        
        //console.log(`Board owner: ${board.owner}, Current user: ${current_user._id}`);
        if (current_user._id.toString() !== board.owner.toString()) {
            //console.log(`Permission denied for user ${current_user._id} on board ${boardId}`);
            return res.status(403).json({
                message: "You are not permitted to carry out this operation"
            });
        }

        console.log(`Permission granted for user ${current_user._id} on board ${boardId}`);
        next();
    } catch (err) {
        console.error("Error in addRemDelPermission middleware:", err);
        return res.status(500).json({message: "Server error", error: err.message});
    }
}
