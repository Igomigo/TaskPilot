// Root file to initialize the server
const express = require("express");
const http = require("node:http");
const { Server } = require("socket.io");
const morgan = require("morgan");
const cors = require("cors");
const cookie_parser = require("cookie-parser");
const dotenv = require("dotenv").config();

const dbConnect = require("./config/mongodbClient");
const authRoute = require("./routes/authRoute");
const authWare = require("./middlewares/authWare");
const userRoute = require("./routes/userRoute");
const boardRoute = require("./routes/boardRoute");
const listRoute = require("./routes/listRoute");
const cardRoute = require("./routes/cardRoute");
const commentRoute = require("./routes/commentRoute");
const logRoute = require("./routes/activityLogRoutes");

// Initialize the express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST"]
    }
});

// Initialize the database connection
dbConnect();

const PORT = process.env.PORT || 3000;

// Set the middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(cookie_parser());
app.use("/auth", authRoute);
app.use("/u", userRoute);
app.use("/b", boardRoute);
app.use("/b", listRoute);
app.use("/b", cardRoute);
app.use("/c", commentRoute);
app.use("/b", logRoute);

// Test the server response
app.get("/ping", authWare, (req, res) => {
    res.status(200).json("Server says pong");
    console.log("Pong");
});

// run the server
server.listen(PORT, () => {
    console.log("Server is listening on port:", PORT);
});

module.exports = { io };