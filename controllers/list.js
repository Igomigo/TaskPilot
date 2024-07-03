// Contains controllers related to list management

const List = require("../models/list");
const Board = require("../models/board");

exports.createList = async (req, res) => {
    // Creates a new list within a board
    try {
        const boardId = req.params.boardId;
        const {title, description, position} = req.body;
        if (!title) {
            return res.status(400).json({error: "missing title"});
        }
        if (!position) {
            return res.status(400).json({error: "missing position"});
        }
        const list = new List({
            title: title,
            description: description,
            position: position,
            board: boardId,
            createdBy: req.current_user._id
        });
        const savedList = await list.save();
        // update the board accordingly
        await Board.findByIdAndUpdate(boardId,
            {$push: {"lists": savedList._id}},
            {new: true}
        );
        return res.status(201).json(savedList);
    } catch (err) {
        console.log(`${err}`);
        return res.status(500).json({error: "An error occured during list creation"});
    }
}

exports.getLists = async (req, res) => {
    // Retrieves a particular list within a board
    try {
        const id = req.params.id;
        const list = await List.findById(id);
        if (!list) {
            return res.status(400).json({error: "Not found"});
        }
        return res.status(200).json(list);
    } catch (err) {
        console.log(`${err}`);
        return res.status(500).json({error: err.message});
    }
}

exports.updateList = async (req, res) => {
    // updates a list data
    try {
        const id = req.params.id;
        const data = req.body;
        const list = await List.findById(id);
        if (!list) {
            return res.status(400).json({error: "Not found"});
        }
        Object.keys(data).forEach(key => {
            list[key] = data[key];
        });
        list.updatedAt = Date.now();
        await list.save();
        return res.status(200).json(list);
    } catch (err) {
        console.log(`${err}`);
        return res.status(500).json({error: err.message});
    }
}

exports.deleteList = async (req, res) => {
    // Delete a list from the board
    try {
        const id = req.params.id;
        const list = await List.findByIdAndDelete(id);
        if (!list) {
            return res.status(400).json({error: "List not found"});
        }
        // Also delete the list id from the board's list field
        const boardId = list.board;
        await Board.findByIdAndUpdate(boardId, {
            $pull: {lists: id}
        });
        return res.status(200).json({
            message: "list deleted successfully"
        });
    } catch (err) {
        console.log(`${err}`);
        return res.status(500).json({error: err.message});
    }
}