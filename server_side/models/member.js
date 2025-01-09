const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const memberSchema = new Schema({
    board: {
        type: Schema.Types.ObjectId,
        ref: "Board",
        required: true
    },
    role: {
        type: String,
        enum: ["admin", "member"],
        default: "member"
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true
});

memberSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model("Member", memberSchema);