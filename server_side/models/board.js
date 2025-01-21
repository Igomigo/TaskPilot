const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BoardSchema = new Schema({
    title: {
        type: String,
        required: true,
        maxLength: 100
    },
    description: {
        type: String,
        maxLength: 500,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    admins: [{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }],
    members: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    lists: [{
        type: Schema.Types.ObjectId,
        ref: "List"
    }],
    status: {
        type: String,
        enum: ["In Progress", "Completed"],
        default: "In Progress"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Board", BoardSchema);