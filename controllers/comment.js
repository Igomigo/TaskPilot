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