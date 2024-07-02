/**
 * Contains controllers related to board management
 */

const Board = require("../models/board");

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
        return res.status(201).json({
            status: "success",
            board: board
        });
    } catch (err) {
        console.log(`${err}`);
        return res.status(500).json({error: err.message});
    }
}

exports.getBoards = async (req, res) => {
    // Retrieves all boards for the current user
    try {
        const current_user = req.current_user;
        const boards = await Board.find({owner: current_user._id});
        if (boards.length === 0) {
            console.log("User has no board");
            return res.status(404).json({});
        }
        res.status(200).json(boards);
    } catch (err) {
        console.log(`${err}`);
        return res.status(500).json({error: err.message});
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
        return res.status(500).json({error: err.message});
    }
}

exports.updateBoard = async (req, res) => {
    // Updates a board data
    try {
        const id = req.params.id;
        const data = req.body;
        const board = await Board.findById(id);
        if (!board) {
            return res.status(404).json({});
        }
        // update the board manually
        Object.keys[data].forEach(key => {
            board[key] = data[key]
        });
        board.updatedAt = Date.now();
        await board.save();
        return res.status(200).json(board);
    } catch (err) {
        console.log(`${err}`);
        return res.status(500).json({error: err.message});
    }
}

exports.deleteBoard = async (req, res) => {
    // Deletes a particular board from the database
    try {
        const id = req.params.id;
        const deletedBoard = await Board.findByIdAndDelete(id);
        if (!deletedBoard) {
            return res.status(404).json({message: "Board not found"});
        }
        return res.status(200).json({message: "Board deleted successfully"});
    } catch (err) {
        console.log(`${err}`);
        res.status(500).json({error: err.message});
    }
}