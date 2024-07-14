// Comment management

const Comment = require("../models/comment");
const Card = require("../models/card");
const List = require("../models/list");
const ActivityLog = require("../models/activityLog");

exports.createComment = async (req, res) => {
    // Create a new comment
    try {
        const cardId = req.params.cardId;
        const current_user = req.current_user;
        const {text} = req.body
        if (!text) {
            return res.status(400).json({error: "missing text"});
        }
        // create new comment document
        const comment = new Comment({
            text: text,
            createdBy: current_user._id,
            card: cardId
        });
        await comment.save();
        // Update the comments array of the associated card document
        const card = await Card.findByIdAndUpdate(cardId, {
            $push: {comments: comment._id},
            updatedAt: Date.now()
        }, { new: true });
        // find the list via the cardId
        const list = await List.findOne({cards: {$in: [cardId]}});
        if (!list) {
            // Incase no list is found
            console.log('No list found containing the specified cardId');
            return res.status(404).json({message: 'List not found'});
        }
        // Log the create activity
        const logger = new ActivityLog({
            action: "create",
            entity: "Comment",
            entityId: comment._id,
            details: `${current_user.username} on ${card.title}: ${comment.text}`,
            createdBy: current_user._id,
            boardId: list.board,
            listId: list._id,
            cardId: cardId
        });
        await logger.save();
        // emit the event to all connected clients
        const io = req.app.get("socketio");
        io.to(list.board).emit("createComment", comment);
        // return a response to the client
        return res.status(201).json(comment);
    } catch (err) {
        console.log(`${err}`);
        return res.status(500).json({
            error: `An error occured internally: ${err.message}`
        });
    }
}

exports.getComments = async (req, res) => {
    // Retrieve all comments for a particular card
    try {
        const cardId = req.params.cardId;
        const comments = await Comment.find({card: cardId});
        if (comments.length === 0) {
            return res.status(404).json({error: "Comments not found"});
        }
        return res.status(200).json(comments);
    } catch (err) {
        console.log(`${err}`);
        return res.status(500).json({
            error: `An error occured internally: ${err.message}`
        });
    }
}

exports.deleteComment = async (req, res) => {
    // Delete a comment
    try {
        const commentId = req.params.commentId;
        const current_user = req.current_user;
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({error: "Comments not found"});
        }
        await Comment.findByIdAndDelete(commentId);
        // Delete the ref from the card document
        const card = await Card.findByIdAndUpdate(comment.card, {
            $pull: {comments: comment._id},
            updatedAt: Date.now()
        }, { new: true });
        // Collect the list the card references
        const list = await List.findOne({cards: {$in: [card._id]}});
        if (!list) {
            // Incase no list is found
            console.log('No list found containing the specified cardId');
            return res.status(404).json({message: 'List not found'});
        }
        // Log the delete operation
        const logger = new ActivityLog({
            action: "delete",
            entity: "Comment",
            entityId: comment._id,
            details: `${current_user.username} on ${card.title} deleted: ${comment.text}`,
            createdBy: current_user._id,
            boardId: list.board,
            cardId: card._id
        });
        await logger.save();
        // emit the event to all connected clients
        const io = req.app.get("socketio");
        io.to(list.board).emit("deleteComment", comment);
        // return a response to the client
        res.status(200).json({message: "Comments successfully deleted"});
    } catch (err) {
        console.log(`${err}`);
        return res.status(500).json({
            error: `An error occured internally: ${err.message}`
        });
    }
}