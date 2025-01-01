const Card = require("../models/card");

export default async function checkDeadline() {
    // Checks and returns lists with expired deadlines for a specific board
    const now = new Date();

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
        if (!acc[card.boardId]) {
            acc[card.boardId] = [];
        }
        acc[card.boardId].push({
            _id: card._id,
            listId: card.listId,
            boardId: card.boardId,
            status: "overdue"
        });
        return acc;
    }, {});

    return overdueCardsByBoardId;
}