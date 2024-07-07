/**
 * Contains controllers related to board management
 */

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
        const boards = await Board.find({owner: current_user._id});
        if (boards.length === 0) {
            console.log("Board not found");
            return res.status(404).json({error: "Board not found"});
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
        const id = req.params.id;
        const board = await Board.findById(id).populate({
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
        const board = await Board.findById(id);
        if (!board) {
            return res.status(404).json({error: "Board not found"});
        }
        // update the board manually
        Object.keys(data).forEach(key => {
            board[key] = data[key]
        });
        board.updatedAt = Date.now();
        await board.save();
        return res.status(200).json(board);
    } catch (err) {
        console.log(`${err}`);
        return res.status(500).json({
            error: `An internal error occured: ${err.message}`});
    }
}

exports.deleteBoard = async (req, res) => {
    // Deletes a particular board and all associated data from the database
    try {
        const id = req.params.id;
        // find the board by id
        const board = await Board.findById(id);
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