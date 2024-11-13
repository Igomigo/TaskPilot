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

/**
 * GET request to retrieve a card data
 * url: http://localhost:3000/b/cards/:cardId
 */
router.get("/cards/:cardId", authWare, card.getCard);

/**
 * PUT request to update a card data
 * url: http://localhost:3000/b/:cardId/update
 */
router.put("/:cardId/update", authWare, card.updateCard);

/**
 * DELETE request to delete a card and related data
 * url: http://localhost:3000/b/:cardId/delete
 */
router.delete("/:cardId/delete", authWare, card.deleteCard);

module.exports = router;