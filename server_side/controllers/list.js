// Contains controllers related to list management

const List = require("../models/list");
const Board = require("../models/board");
const Card = require("../models/card");
const Comment = require("../models/comment");
const ActivityLog = require("../models/activityLog");

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
            {$push: {"lists": savedList._id},
            updatedAt: Date.now( )},
            {new: true}
        );
        const logger = new ActivityLog({
            action: "create",
            entity: "List",
            entityId: list._id,
            details: `${req.current_user.username} created ${list.title}`,
            createdBy: req.current_user._id,
            boardId: boardId,
            listId: list._id
        });
        await logger.save();
        // return a response to the client
        return res.status(201).json(savedList);
    } catch (err) {
        console.log(`${err}`);
        return res.status(500).json({
            error: `An error occured internally: ${err.message}`
        });
    }
}

exports.getLists = async (req, res) => {
    // Retrieves all lists within a board
    const boardId = req.params.boardId;
    const current_user = req.current_user;

    try {
        const list = await List.findOne({boards: boardId})
        .populate("board")
        .populate("cards");

        // Check if the user is authorized to see this list
        if (!list.board.members.includes(current_user._id)) {
            return res.status(403).json({error: "You're not a member of this board"});
        }

        if (!list) {
            return res.status(200).json([]);
        }

        return res.status(200).json(list);

    } catch (err) {
        console.log(`${err}`);
        return res.status(500).json({
            error: `An error occured internally: ${err.message}`
        });
    }
}

exports.updateList = async (req, res) => {
    // updates a list data
    try {
        const listId = req.params.listId;
        const data = req.body;
        const current_user = req.current_user;
        const list = await List.findById(listId);
        if (!list) {
            return res.status(404).json({error: "Not found"});
        }
        // prepare the log details
        let logDetails = [];
        Object.keys(data).forEach(key => {
            if (list[key] !== data[key]) {
                logDetails.push(
                    `${current_user.username} changed list from ${list[key]} to ${data[key]}`);
                    list[key] = data[key];
            }
        });
        if (logDetails.length > 0) {
            logger = new ActivityLog({
                action: "Update",
                entity: "List",
                entityId: list._id,
                details: logDetails.join("; "),
                createdBy: current_user._id,
                boardId: list.board,
                listId: list._id
            });
            await logger.save();
        }
        list.updatedAt = Date.now();
        await list.save();
        // emit the event to all connected clients
        const io = req.app.get("socketio");
        io.to(list.board).emit("updateList", list);
        // return a response to the client
        return res.status(200).json(list);
    } catch (err) {
        console.log(`${err}`);
        return res.status(500).json({
            error: `An error occured internally: ${err.message}`
        });
    }
}
 
exports.deleteList = async (req, res) => {
    // Delete a list and all associated data from the board
    try {
        const listId = req.params.listId;
        const list = await List.findById(listId);
        const board = await Board.findById(list.board);
        const current_user = req.current_user;
        if (current_user._id.toString() !== list.createdBy.toString(
        ) && current_user._id.toString() !== board.owner.toString()) {
            return res.status(403).json({
                message: "You are not permitted to delete this list"
            });
        }
        if (!list) {
            return res.status(400).json({error: "List not found"});
        }
        // Delete all the associated data for the list
        // Delete the comment and card data for that list
        const cardIds = list.cards;
        if (cardIds.length > 0) {
            await Promise.all(cardIds.map(async (cardId) => {
                await Comment.deleteMany({card: cardId});
                await Card.findByIdAndDelete(cardId);
            }));
        }
        // delete the actual list
        await List.findByIdAndDelete(listId);
        // delete the reference from the board document
        const boardId = list.board;
        await Board.findByIdAndUpdate(boardId, {
            $pull: {lists: listId},
            updatedAt: Date.now()
        });
        // Log the delete activity
        let logDetails = `${req.current_user.username} deleted ${list.title} from this board`
        const logger = new ActivityLog({
            action: "delete",
            entity: "List",
            entityId: list._id,
            details: logDetails,
            createdBy: req.current_user._id,
            boardId: boardId,
            listId: list._id
        });
        await logger.save();
        // emit the event to all connected clients
        const io = req.app.get("socketio");
        io.to(list.board).emit("deleteList", list);
        // return a response to the client
        return res.status(200).json({
            message: "list deleted successfully"
        });
    } catch (err) {
        console.log(`${err}`);
        return res.status(500).json({
            error: `An error occured internally: ${err.message}`
        });
    }
}