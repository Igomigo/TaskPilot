module.exports = (io) => {
    // Set up the socket handlers for real time operations
    io.on("connection", (socket) => {
        console.log("Connection to socket successful");

        // Handle joining a board room
        socket.on("joinBoard", boardId => {
            socket.join(boardId);
            console.log("Client joined the board:", boardId);
        });

        // Handle leaving a board room
        socket.on("leaveBoard", boardId => {
            socket.leave(boardId);
            console.log("Client left the board:", boardId);
        });

        // Handle disconnections
        socket.on("disconnection", () => {
            console.log("Client disconnected")
        });
    });
}