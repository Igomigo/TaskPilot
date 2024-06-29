// Connects the server with the mongodb database

const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load the environment variable with dotenv
dotenv.config();

const dbConfig = async () => {
    try {
        console.log("Establishing a connection with mongoDB...");
        // await mongoose.connect(process.env.MONGODB_URI);
        await mongoose.connect("mongodb://localhost:127017/TaskPilotDb");
        console.log("Connection to the mongodb database successful");
    } catch (err) {
        console.log(`Error while connecting to mongodb: ${err.message}`);
    }
}

module.exports = dbConfig;