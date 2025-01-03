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

    console.log("boardId:", boardId);

    try {
        if (!title) {
            return res.status(400).json({error: "missing title"});
        }

        // Check that another card with same title doesn't exist
        const exists = await Card.findOne({
            title: title,
            listId: listId
        });

        if (exists) {
            return res.status(409).json({
                error: true,
                message: "Card already exists in this list"
            });
        }

        const card = new Card({
            title: title,
            board: boardId,
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
        //console.log("List Data:", list);

        //console.log("Card Data:", savedCard);

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
    const cardTitle = req.params.cardTitle;

    try {
        const card = await Card.findOne({
            title: cardTitle
        }).populate({
            path: "comments",
            populate: {
                path: "createdBy",
                model: "User"
            }
        });

        //console.log("getCard:", card);

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
        const updateData = req.body;
        
        // Check if the card exists before updating
        const card = await Card.findById(cardId);
        if (!card) {
            return res.status(404).json({ error: "Card not found" });
        }

        // Update the card data
        if (updateData.checked !== undefined) {
            updateData.status = updateData.checked ? "completed" : "pending";
        }

        const updatedCard = await Card.findByIdAndUpdate(
            cardId,
            { $set: updateData },
            { new: true }
        );

        if (!updatedCard) {
            return res.status(404).json({error: "Card not found"});
        }

        // Prepare logDetails
        let logDetails = Object.keys(updateData).map(key => 
            `${current_user.username} changed ${key} to ${updateData[key]}`
        );

        //console.log("Board Id from card:", card);

        if (logDetails.length > 0) {
            const logger = new ActivityLog({
                action: "Update",
                entity: "card",
                entityId: updatedCard._id,
                details: logDetails.join("; "),
                createdBy: req.current_user._id,
                boardId: updatedCard.board,
                listId: updatedCard.listId
            });
            await logger.save();
        }

        return res.status(200).json(updatedCard);
        
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: `An error occurred internally: ${err.message}`
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