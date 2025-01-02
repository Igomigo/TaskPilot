const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CardSchema = new Schema({
    title: {
        type: String,
        required: true,
        maxLength: 50,
        unique: true
    },
    description: {
        type: String,
        maxLength: 300
    },
    dueDate: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ['pending', 'overdue', 'completed'],
        default: "pending"
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
    boardId: {
        type: Schema.Types.ObjectId,
        ref: "Board",
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