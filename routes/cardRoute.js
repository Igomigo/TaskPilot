// Card Routes

const express = require("express");
const authWare = require("../middlewares/authWare");
const card = require("../controllers/card");

const router = express.Router();

/**
 * POST request to create a new card
 * url: http://localhost:3000/b/:listId/card
 */
router.post("/:listId/card", authWare, card.createCard);

module.exports = router;