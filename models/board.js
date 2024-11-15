const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BoardSchema = new Schema({
    title: {
        type: String,
        required: true,
        maxLength: 50
    },
    description: {
        type: String,
        maxLength: 100
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    lists: [{
        type: Schema.Types.ObjectId,
        ref: "List"
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model("Board", BoardSchema);