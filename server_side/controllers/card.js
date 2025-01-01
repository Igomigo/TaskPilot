/**
 * Contains controllers related to card management
 */
const Card = require("../models/card");
const List = require("../models/list");
const Board = require("../models/board");
const Comment = require("../models/comment");
const ActivityLog = require("../models/activityLog");


exports.createCard = async (req, res) => {
    // Creates a new card and updates the related list document
    const listId = req.params.listId;
    const current_user = req.current_user;
    const {title, boardId} = req.body;

    try {
        if (!title) {
            return res.status(400).json({error: "missing title"});
        }

        const card = new Card({
            title: title,
            boardId: boardId,
            listId: listId,
            createdBy: current_user._id
        });
        const savedCard = await card.save();

        // update the list accordingly
        const list = await List.findByIdAndUpdate(listId, {
            $push: {"cards": savedCard._id},
            updatedAt: Date.now()
            },
            {new: true}
        );

        // Create the actiivity log
        const logger = new ActivityLog({
            action: "create",
            entity: "card",
            entityId: card._id,
            details: `${current_user.username} created the card: ${card.title}`,
            createdBy: current_user._id,
            boardId: list.board,
            listId: list._id,
            cardId: card._id
        });
        await logger.save();

        // return a response to the client
        return res.status(201).json(savedCard);

    } catch (err) {
        console.log(`${err}`);
        return res.status(500).json({
            error: `An error occured internally: ${err.message}`});
    }
}

exports.getCard = async (req, res) => {
    // Retrieves a specific card
    try {
        const cardId = req.params.cardId;
        const card = await Card.findById(cardId).populate("comments");
        if (!card) {
            return res.status(404).json({error: "card not found"});
        }
        return res.status(200).json(card);
    } catch (err) {
        console.log(`${err}`);
        return res.status(500).json({
            error: `An error occured internally: ${err.message}`
        });
    }
}

exports.updateCard = async (req, res) => {
    // Updates a card data
    try {
        const current_user = req.current_user;
        const cardId = req.params.cardId;
        const data = req.body;
        const card = await Card.findById(cardId);
        if (!card) {
            return res.status(404).json({error: "Card not found"});
        }
        const list = await List.findById(card.listId);
        // prepare logDetails
        let logDetails = [];
        Object.keys(data).forEach(key => {
            if (card[key] !== data[key]) {
                logDetails.push(`${current_user.username} changed ${card[key]} to ${data[key]}`);
                card[key] = data[key];
            }
        });
        if (logDetails.length > 0) {
            const logger = new ActivityLog({
                action: "Update",
                entity: "card",
                entityId: list._id,
                details: logDetails.join("; "),
                createdBy: req.current_user._id,
                boardId: list.board,
                listId: list._id
            });
            await logger.save();
        }
        card.updatedAt = Date.now();
        await card.save();
        // emit the event to all connected clients
        const io = req.app.get("socketio");
        io.to(list.board).emit("updateCard", card);
        // return a response to the client
        return res.status(200).json(card);
    } catch (err) {
        return res.status(500).json({
            error: `An error occured internally: ${err.message}`
        });
    }
}

exports.deleteCard = async (req, res) => {
    try {
        // Delete a card and associated data
        const cardId = req.params.cardId;
        const current_user = req.current_user;
        const theCard = await Card.findById(cardId);
        const theList = await List.findById(theCard.listId);
        const board = await Board.findById(theList.board);
        if (current_user._id.toString() !== theCard.createdBy.toString(
        ) && current_user._id.toString() !== board.owner.toString()) {
            return res.status(403).json({
                message: "You are not permitted to delete this card"
            });
        }
        // first delete the comment within that card
        await Comment.deleteMany({card: cardId});
        // Then delete the card itself
        const card = await Card.findByIdAndDelete(cardId);
        if (!card) {
            return res.status(404).json({error: "Card not found"});
        }
        // delete the card reference from the associated list
        const list = await List.findByIdAndUpdate(card.listId, {
            $pull: {cards: cardId},
            updatedAt: Date.now()
        }, {new: true});

        // Log activiies
        const logger = new ActivityLog({
            action: "delete",
            entity: "Card",
            entityId: card._id,
            details: `${req.current_user.username} deleted the card titled: ${card.title}`,
            createdBy: req.current_user._id,
            boardId: list.board,
            listId: list._id,
            cardId: card._id
        });
        await logger.save();
        // emit the event to all connected clients
        const io = req.app.get("socketio");
        io.to(list.board).emit("deleteCard", card);
        // return a response to the client
        return res.status(200).json({
            message: "Card and associated comments deleted successfully"
        });
    } catch (err) {
        return res.status(500).json({
            error: `An error occured internally: ${err.message}`
        });
    }
}