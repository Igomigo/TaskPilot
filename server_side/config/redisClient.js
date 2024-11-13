// Establishes a connection to the redis database

const redis = require("redis");

// Create the redis object
const client = redis.createClient();

console.log("Connecting to redis...");

client.on("connect", () => {
    console.log("Client connected to the redis server :)");
});
client.on("error", (err) => {
    console.log("Error while connecting to redis :(");
});

client.connect();

module.exports = client;