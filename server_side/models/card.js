const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CardSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String
    },
    dueDate: {
        type: Date,
        default: null
    },
    board: {
        type: Schema.Types.ObjectId,
        ref: "Board",
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'overdue', 'completed'],
        default: "pending"
    },
    checked: {
        type: Boolean,
        default: false
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }],
    listId: {
        type: Schema.Types.ObjectId,
        ref: "List",
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
}, {
    timestamps: true
});

module.exports = mongoose.model("Card", CardSchema);