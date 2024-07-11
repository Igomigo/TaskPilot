/**
 * Contains controllers related to board management
 */

const User = require("../models/user");
const Board = require("../models/board");
const List = require("../models/list");
const Card = require("../models/card");
const Comment = require("../models/comment");
const ActivityLog = require("../models/activityLog");

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
            owner: current_user._id
        });
        await board.save();
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
        return res.status(201).json(board);
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
        });
        if (boards.length === 0) {
            console.log("No board found");
            return res.status(404).json({error: "You have not created any board yet"});
        }
        res.status(200).json(boards);
    } catch (err) {
        console.log(`${err}`);
        return res.status(500).json({
            error: `An internal error occured: ${err.message}`});
    }
}

exports.getBoardById = async (req, res) => {
    // Retrieves a single board data based on the id
    try {
        const boardId = req.params.boardId;
        const board = await Board.findById(boardId).populate({
            path: "lists",
            populate: {
                path: "cards"
            }
        }).exec();
        if (!board) {
            return res.status(404).json({});
        }
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
        return res.status(200).json(board);
    } catch (err) {
        console.log(`${err}`);
        return res.status(500).json({
            error: `An internal error occured: ${err.message}`});
    }
}

exports.addMember = async (req, res) => {
    // Adds a member to the board.members field
    try {
        const boardId = req.params.boardId;
        const current_user = req.current_user;
        const { email } = req.body;
        const board = await Board.findById(boardId);
        if (!board) {
            console.log(`Board <${board.title}> not found`);
            return res.status(404).json({message: "Board not found"});
        }
        const user = await User.findOne({email: email});
        if (user && board.members.includes(user._id)) {
            console.log("Member already exists in the board");
            return res.status(409).json({
                message: "User already exists in the board"
            });
        }
        // add member to the board
        board.members.push(user._id);
        await board.save();
        // log the activity
        const logger = new ActivityLog({
            action: "Add member",
            entity: "Board",
            entityId: boardId,
            details: `${current_user.username} added ${email} to this board`,
            createdBy: current_user._id,
            boardId: boardId,
        });
        await logger.save()
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
        return res.status(200).json({message: "User successfully removed from the board"});
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
        return res.status(200).json({message: "Board deleted successfully"});
    } catch (err) {
        console.log(`Error deleting board: ${err.message}`);
        res.status(500).json({
            error: `An internal error occured: ${err.message}`});
    }
}