const jwt = require("jsonwebtoken");
const cron = require("node-cron");
const checkDeadline = require("../utils/deadlineChecker");
const Card = require("../models/card");
const List = require("../models/list");
const Board = require("../models/board");
const Comment = require("../models/comment");
const ActivityLog = require("../models/activityLog");
const User = require("../models/user");

function setupSocketServer(io) {
    // Middleware for authentication
    io.use(async (socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            console.log("No token provided");
            socket.emit("Auth_error", "No token provided");
            return next(new Error("No token provided"));
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const current_user = await User.findById(decoded.userId);
            if (!current_user) {
                socket.emit("Auth_error", "User not found");
                return next(new Error("User not found"));
            }
            socket.userId = decoded.userId;
            socket.current_user = current_user;
            next();
        } catch (err) {
            console.log(err);
            socket.emit("Auth_error", "Authentication error");
            return next(new Error("Authentication error"));
        }
    });

    // Connections handler
    io.on("connection", (socket) => {
        console.log("A user connected:", socket.userId);

        // Create a room for current user
        socket.join(socket.userId);

        // Join board event
        socket.on("joinBoard", (boardId) => {
            if (!boardId) {
                console.log("Invalid board Id received");
                return;
            }
            socket.join(boardId);
            console.log(`User ${socket.userId} joined the board ${boardId}`);
        });

        // Handle the new card event
        socket.on("newCard", async (newCard) => {
            if (newCard) {
                // Check that another card with same title doesn't exist
                const exists = await Card.findOne({
                    title: newCard.title,
                    listId: newCard.listId
                });

                if (exists) {
                    io.to(socket.userId).emit("alreadyExists", "Card already exists in this list");
                    return;
                }

                const card = new Card({
                    title: newCard.title,
                    board: newCard.boardId,
                    listId: newCard.listId,
                    createdBy: socket.current_user._id
                });
                const savedCard = await card.save();

                // update the list accordingly
                const list = await List.findByIdAndUpdate(newCard.listId, {
                    $push: {"cards": savedCard._id},
                    updatedAt: Date.now()
                    },
                    {new: true}
                );

                // Create the actiivity log
                const logger = new ActivityLog({
                    action: "create",
                    entity: "card",
                    entityId: card._id,
                    details: `${socket.current_user.username} created the card: ${card.title}`,
                    createdBy: socket.current_user._id,
                    boardId: list.board,
                    listId: list._id,
                    cardId: card._id
                });
                await logger.save();

                io.to(newCard.boardId).emit("cardCreated", savedCard);
            }
        });

        // Handle the new list event
        socket.on("newList", async (list) => {
            if (list) {
                const newList = new List({
                    title: list.title,
                    position: list.position,
                    board: list.boardId,
                    createdBy: socket.current_user._id
                });
                const savedList = await newList.save();
        
                // update the board accordingly
                await Board.findByIdAndUpdate(list.boardId,
                    {$push: {"lists": savedList._id},
                    updatedAt: Date.now( )},
                    {new: true}
                );
        
                // Log the change
                const logger = new ActivityLog({
                    action: "create",
                    entity: "List",
                    entityId: savedList._id,
                    details: `${socket.current_user.username} created the list: ${savedList.title}`,
                    createdBy: socket.current_user._id,
                    boardId: list.boardId,
                    listId: savedList._id
                });
                await logger.save();

                // Emit the list created event to the client
                io.to(list.boardId).emit("createdList", savedList);
            }
        });

        // Leave board event
        socket.on("leaveBoard", (boardId) => {
            socket.leave(boardId);
            console.log(`User ${socket.userId} left the board ${boardId}`);
        });

        socket.on("disconnect", (socket) => {
            console.log("User disconnected:", socket.userId);
        });
    });

    // Schedule deadline checker using cron
    cron.schedule('* * * * *', async () => {
        //console.log("Running deadline check for all boards...");
        const overdueCardsByBoardId = await checkDeadline();

        for (const [boardId, overdueCards] of Object.entries(overdueCardsByBoardId)) {
            if (overdueCards.length > 0) {
                //console.log(overdueCards);
                io.to(boardId).emit("overdueCards", overdueCards);
            }
        }
    });
}

module.exports = setupSocketServer;