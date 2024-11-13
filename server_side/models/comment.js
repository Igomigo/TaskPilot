const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    card: {
        type: Schema.Types.ObjectId,
        ref: "Card",
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Comment", CommentSchema);