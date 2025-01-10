/**
 * Contains controllers related to board management
 */

const User = require("../models/user");
const Board = require("../models/board");
const List = require("../models/list");
const Card = require("../models/card");
const Comment = require("../models/comment");
const ActivityLog = require("../models/activityLog");
const Member = require("../models/member");

exports.createBoard = async (req, res) => {
    // Creates a new board
    try {
        const current_user = req.current_user;
        const {title, description} = req.body;

        if (!title) {
            return res.status(400).json({Error: "Title missing"});
        }
        // Create the board
        const board = new Board({
            title: title,
            description: description,
            owner: current_user._id,
            members: current_user._id
        });
        await board.save();

        // Create the board member data for this user
        const member = new Member({
            board: board._id,
            role: "admin",
            user: current_user._id
        });
        await member.save();

        // Populate the activity log
        const logger = new ActivityLog({
            action: "create",
            entity: "board",
            entityId: board._id,
            details: `${current_user.username} created this board`,
            createdBy: current_user._id,
            boardId: board._id,
        });
        await logger.save();

        // Retrive the created group and populate the members field
        const boardData = await Board.findById(board._id)
        .populate("members");

        //console.log(boardData);

        // Return a response to the client
        return res.status(201).json(boardData);

    } catch (err) {
        console.log(`${err}`);
        return res.status(500).json({
            error: `An internal error occurred: ${err.message}`});
    }
}

exports.getBoards = async (req, res) => {
    // Retrieves all boards for the current user
    try {
        const current_user = req.current_user;
        
        const boards = await Board.find({
            $or: [
                {owner: current_user._id},
                {members: {$in: [current_user._id]}}
            ]
        }).sort({ updatedAt: -1 }).populate("members");

        return res.status(200).json(boards);
    } catch (err) {
        console.log(`${err}`);
        return res.status(500).json({
            error: `An internal error occured: ${err.message}`});
    }
}

exports.getBoardById = async (req, res) => {
    // Retrieves a single board data based on the id
    const boardId = req.params.boardId;
    const current_user = req.current_user;

    try {
        const board = await Board.findById(boardId).populate({
            path: "lists",
            populate: {
                path: "cards"
            }
        }).exec();

        // Check if board exists
        if (!board) {
            return res.status(404).json({});
        }

        // // Check if the current user is authorized to see rthis board
        // if (!board.members.includes(current_user._id)) {
        //     return res.status(403).json({
        //         error: "You're not authorized to see this board"
        //     });
        // }

        // Return a response back to the client
        return res.status(200).json(board);
    } catch (err) {
        console.log(`${err}`);
        return res.status(500).json({
            error: `An internal error occured: ${err.message}`});
    }
}

exports.updateBoard = async (req, res) => {
    // Updates a board data
    try {
        const id = req.params.id;
        const data = req.body;
        const current_user = req.current_user;
        const board = await Board.findById(id);
        if (!board) {
            return res.status(404).json({error: "Board not found"});
        }
        // set up log details
        const logDetails = [];
        // update the board manually and implement logging
        Object.keys(data).forEach(key => {
            if (board[key] !== data[key]) {
                console.log("Constructing the activity log details");
                const msg = `${current_user.username} changed board ${key} from ${board[key]} to ${data[key]}`
                logDetails.push(msg);
                board[key] = data[key]
            }
        });
        if (logDetails.length > 0) {
            const logger = new ActivityLog({
                action: "update",
                entity: "Board",
                entityId: board._id,
                details: logDetails.join("; "),
                boardId: board._id,
                createdBy: current_user._id
            });
            await logger.save();
            console.log("update board Log activity successfully saved");
        }
        board.updatedAt = Date.now();
        await board.save();
        // return a response to  the client
        return res.status(200).json(board);
    } catch (err) {
        console.log(`${err}`);
        return res.status(500).json({
            error: `An internal error occured: ${err.message}`});
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
        
        // return a response to the client
        return res.status(200).json(board);

    } catch (err) {
        console.log(`${err}`);
        return res.status(500).json({
            error: `An internal error occured: ${err.message}`
        });
    }
}

exports.removeMember = async (req, res) => {
    // Removes a member from the board
    try {
        const { boardId, userId } = req.params;
        const current_user = req.current_user;
        const board = await Board.findById(boardId);
        if (!board) {
            return res.status(404).json({error: "Board not found"});
        }
        const userIndex = board.members.indexOf(userId);
        if (userIndex === -1) {
            return res.status(400).json({
                error: "User not a member of the board"
            });
        }
        // remove user from the board
        board.members.splice(userIndex, 1);
        await board.save();
        // log the activity
        const user = await User.findById(userId);
        const logger = new ActivityLog({
            action: "remove member",
            entity: "Board",
            entityId: boardId,
            details: `${current_user.username} removed ${user.email} from the board`,
            createdBy: current_user._id,
            boardId: boardId
        });
        await logger.save();
        // emit the event to all connected clients
        const io = req.app.get("socketio");
        io.to(board._id).emit("removeMember", board);
        // return a response to the client
        return res.status(200).json({
            message: "User successfully removed from the board",
            data: board
        });
    } catch (err) {
        console.log(`${err}`);
        return res.status(500).json({
            error: `An internal error occured: ${err.message}`
        }); 
    }
}

exports.deleteBoard = async (req, res) => {
    // Deletes a particular board and all associated data from the database
    try {
        const boardId = req.params.boardId;
        // find the board by id
        const board = await Board.findById(boardId);
        if (!board) {
            return res.status(404).json({message: "Board not found"});
        }
        // delete the list and data for that board
        const listIds = board.lists;
        await Promise.all(listIds.map(async (listId) => {
            const list = await List.findById(listId)
            if (list) {
                const cardIds = list.cards;
                // iterate through to delete the comments and card data
                await Promise.all(cardIds.map(async (cardId) => {
                    await Comment.deleteMany({card: cardId});
                    await Card.findByIdAndDelete(cardId);
                }));
            }
            // delete the list
            await List.findByIdAndDelete(listId);
        }));
        // Finally delete the board itelf
        await Board.findByIdAndDelete(id);
        // emit the event to all connected clients
        const io = req.app.get("socketio");
        io.to(board._id).emit("deleteBoard", board);
        // return a response to the client
        return res.status(200).json({message: "Board deleted successfully"});
    } catch (err) {
        console.log(`Error deleting board: ${err.message}`);
        res.status(500).json({
            error: `An internal error occured: ${err.message}`});
    }
}