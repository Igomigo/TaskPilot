/**
 * Contains controllers related to card management
 */
const Card = require("../models/card");
const List = require("../models/list");
const Comment = require("../models/comment");

exports.createCard = async (req, res) => {
    // Creates a new card and updates the related list document
    try {
        const listId = req.params.listId;
        const current_user = req.current_user;
        const {title} = req.body;
        if (!title) {
            return res.status(400).json({error: "missing title"});
        }
        const card = new Card({
            title: title,
            listId: listId,
            createdBy: current_user._id
        });
        const savedCard = await card.save();
        // update the list accordingly
        await List.findByIdAndUpdate(listId, {
            $push: {"cards": savedCard._id},
            updatedAt: Date.now()
            },
            {new: true}
        );
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
        const cardId = req.params.cardId;
        const data = req.body;
        const card = await Card.findById(cardId);
        if (!card) {
            return res.status(404).json({error: "Card not found"});
        }
        Object.keys(data).forEach(key => {
            card[key] = data[key];
        });
        card.updatedAt = Date.now();
        await card.save();
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
        // first delete the comment within that card
        await Comment.deleteMany({card: cardId});
        // Then delete the card itself
        const card = await Card.findByIdAndDelete(cardId);
        if (!card) {
            return res.status(404).json({error: "Card not found"});
        }
        // delete the card reference from the associated list
        await List.findByIdAndUpdate(card.listId, {
            $pull: {cards: cardId},
            updatedAt: Date.now()
        });
         return res.status(200).json({
            message: "Card and associated comments deleted successfully"
        });
    } catch (err) {
        return res.status(500).json({
            error: `An error occured internally: ${err.message}`
        });
    }
}