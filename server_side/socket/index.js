const jwt = require("jsonwebtoken");
const cron = require("node-cron");
const checkDeadline = require("../utils/deadlineChecker");

function setupSocketServer(io) {
    // Middleware for authentication
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            console.log("No token provided");
            return next(new Error("No token provided"));
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    socket.emit("Auth_error", "Token Expired");
                } else {
                    socket.emit("Auth_error", "Invalid Token");
                }
                return next(new Error("Authentication Error"));
            }
            console.log("Socket connected successfully");

            socket.userId = decoded.userId;
            next();
        });
    });

    // Connections handler
    io.on("connection", (socket) => {
        console.log("A user connected:", socket.userId);

        socket.on("joinBoard", (boardId) => {
            if (!boardId) {
                console.log("Invalid board Id received");
                return;
            }
            socket.join(boardId);
            console.log(`User ${socket.userId} joined the board ${boardId}`);
        });

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
        console.log("Running deadline check for all boards...");
        const overdueCardsByBoardId = await checkDeadline();

        for (const [boardId, overdueCards] of Object.entries(overdueCardsByBoardId)) {
            if (overdueCards.length > 0) {
                console.log(overdueCards);
                io.to(boardId).emit("overdueCards", overdueCards);
            }
        }
    });
}

module.exports = setupSocketServer;