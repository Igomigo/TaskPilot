const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CardSchema = new Schema({
    title: {
        type: String,
        required: true,
        maxLength: 50
    },
    description: {
        type: String,
        maxLength: 300
    },
    dueDate: {
        type: Date,
        default: null
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
    labels: [{
        type: String
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model("Card", CardSchema);