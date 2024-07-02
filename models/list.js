const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const listSchema = new Schema({
    title: {
        type: String,
        required: true,
        maxLength: 50
    },
    position: {
        type: Number,
        required: true
    },
    board: {
        type: Schema.Types.ObjectId,
        ref: "Board"
    },
    description: {
        type: String,
        maxLength: 100
    },
    cards: [{
        type: Schema.Types.ObjectId,
        ref: "Card"
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model("List", listSchema);