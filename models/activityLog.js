const mongoose = require("mongooose");
const Schema = mongoose.Schema;

const LogSchema = new Schema({
    action: {
        type: String,
        required: true
    },
    entity: {
        type: String,
        required: true
    },
    entityId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    boardId: {
        type: Schema.Types.ObjectId,
        ref: "Board",
        required: true
    },
    listId: {
        type: Schema.Types.ObjectId,
        ref: "List"
    },
    cardId: {
        type: Schema.Types.ObjectId,
        ref: "Card"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("ActivityLog", LogSchema);