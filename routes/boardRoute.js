// Board routes

const board = require("../controllers/board");
const authWare = require("../middlewares/authWare");
const express = require("express");
const router = express.Router();

/**
 * POST request to create a new board
 * url: http://localhost:3000/board/create
 */
router.post("/create", authWare, board.createBoard);

/**
 * GET request to retrieve all boards for a user
 * url: http://localhost:3000/board
 */
router.get("/", authWare, board.getBoards);

/**
 * GET request to retrieve a particular board and it's associated data
 * url: http://localhost:3000/board/:id
 */
router.get("/:id", authWare, board.getBoardById);

/**
 * PUT request to update a particular board data
 * url: http://localhost:3000/board/update/:id
 */
router.put("/update/:id", authWare, board.updateBoard);

/**
 * DELETE request to delete a particular board
 * url: http://localhost:3000/board
 */
router.delete("/delete/:id", authWare, board.deleteBoard);


module.exports = router;