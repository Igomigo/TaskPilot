// Initializes the job processing queue

const queue = require("bull");

// Create the queue
const TaskQueue = new queue("taskQueue", {
    redis: {
        host: "localhost",
        port: 6379
    }
});

// Add events listeners for successful or failed operations
TaskQueue.on("completed", (job, result) => {
    console.log(`
        Job ${job.id} of type ${job.name} completed with result ${result}`);
});

TaskQueue.on("failed", (job, err) => {
    console.log(`
        Job ${job.id} of type ${job.name} failed with error ${err.message}`);
});

module.exports = TaskQueue;