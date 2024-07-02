// Contains controllers related to list management

const List = require("../models/list");

exports.createList = async (req, res) => {
    // Creates a new list within a board
    try {
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
            position: position
        });
        await list.save();
        return res.status(201).json(list);
    } catch (err) {
        console.log(`${err}`);
        return res.status(500).json({error: err.message});
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
        return res.status(200).json({
            message: "list deleted successfully"
        });
    } catch (err) {
        console.log(`${err}`);
        return res.status(500).json({error: err.message});
    }
}