const express = require("express");
const router = express.Router();
const notifications = require("../controllers/notification");
const authWare = require("../middlewares/authWare");

/**
 * GET request to fetch all notifications for a specific user
 * url: http://localhost:3000/notifications
 */
router.get("/notifications", authWare, notifications.fetchNotifications);

module.exports = router;