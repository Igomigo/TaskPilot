// Comment management

const Comment = require("../models/comment");
const Card = require("../models/card");

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
        await Card.findByIdAndUpdate(cardId, {
            $push: {comments: comment._id},
            updatedAt: Date.now()
        });
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
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({error: "Comments not found"});
        }
        await Comment.findByIdAndDelete(commentId);
        // Delete the ref from the card document
        await Card.findByIdAndUpdate(comment.card, {
            $pull: {comments: comment._id},
            updatedAt: Date.now()
        });
    res.status(200).json({message: "Comments successfully deleted"});
    } catch (err) {
        console.log(`${err}`);
        return res.status(500).json({
            error: `An error occured internally: ${err.message}`
        });
    }
}