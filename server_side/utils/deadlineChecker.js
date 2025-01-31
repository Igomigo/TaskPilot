const Card = require("../models/card");

async function checkDeadline() {
    // Checks and returns lists with expired deadlines for a specific board
    const now = new Date();
    //console.log("Check deadline function called");

    // Find and update overdue cards
    const overdueCards = await Card.find(
        {
            status: "pending",
            dueDate: { $lte: now }
        }
    );

    if (overdueCards.length > 0) {
        const cardIds = overdueCards.map(card => card._id);
        await Card.updateMany(
            { _id: { $in: cardIds } },
            { $set: {status: "overdue"} }
        );
    }

    // Group overdue cards by board id
    const overdueCardsByBoardId = overdueCards.reduce((acc, card) => {
        if (!acc[card.board]) {
            acc[card.board] = [];
        }
        acc[card.board].push({
            _id: card._id,
            listId: card.listId,
            boardId: card.board,
            status: "overdue"
        });
        return acc;
    }, {});

    return overdueCardsByBoardId;
}

module.exports = checkDeadline;