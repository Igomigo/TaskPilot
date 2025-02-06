// Activity Log routes

const authWare = require("../middlewares/authWare");
const Log = require("../controllers/activityLog");
const express = require("express");

const router = express.Router();

/**
 * GET request for activity logs for a user
 * url: http://localhost:3000/b/logs/activities
 */
router.get("/activities", authWare, Log.getAllActivities);

/**
 * GET request for activity logs within the board
 * url: http://localhost:3000/b/logs/activity/:boardId
 */
router.get("/activity/:boardId", authWare, Log.getBoardActivities);

/**
 * GET request for activity log within the card level
 * url: http://localhost:3000/b/logs/:boardId/activity/:cardId
 */
router.get("/:boardId/activity/:cardId", authWare, Log.getCardActivities);


module.exports = router;