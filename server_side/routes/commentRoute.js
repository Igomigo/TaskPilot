// Comment Routes

const express = require("express");
const authWare = require("../middlewares/authWare");
const comment = require("../controllers/comment");

const router = express.Router();

/**
 * POST request to create a comment
 * url: http://localhost:3000/c/:cardId/comment
 */
router.post("/:cardId/comment", authWare, comment.createComment);

/**
 * GET request to retrieve all comments within a card
 * url: http://localhost:3000/c/:cardId/comments
 */
router.get("/:cardId/comments", authWare, comment.getComments);

/**
 * DELETE request to delete a comment from the database
 * url: http://localhost:3000/c/:commentId/delete
 */
router.delete("/:commentId/delete", authWare, comment.deleteComment);


module.exports = router;