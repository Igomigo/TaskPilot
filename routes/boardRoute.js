// Board routes

const board = require("../controllers/board");
const authWare = require("../middlewares/authWare");
const permission = require("../middlewares/boardPermissions");
const express = require("express");
const router = express.Router();

/**
 * POST request to create a new board
 * url: http://localhost:3000/b/create
 */
router.post("/create", authWare, board.createBoard);

/**
 * GET request to retrieve all boards for a user
 * url: http://localhost:3000/b
 */
router.get("/", authWare, board.getBoards);

/**
 * GET request to retrieve a particular board and it's associated data
 * url: http://localhost:3000/b/:id
 */
router.get("/:id", authWare, permission.permitUser, board.getBoardById);

/**
 * PUT request to update a particular board data
 * url: http://localhost:3000/b/update/:id
 */
router.put("/update/:id", authWare, board.updateBoard);

/**
 * POST request top add a user to the board
 * url: http://localhost:3000/b/addmember/:boardId
 */
router.post("/addmember/:boardId", authWare, board.addMember);

/**
 * DELETE request to remove a user from the board
 * url: http://localhost:3000/b/:boardId/removemember/:userId
 */
router.delete("/:boardId/deletemember/:userId", authWare, board.removeMember);

/**
 * DELETE request to delete a particular board
 * url: http://localhost:3000/b/:id
 */
router.delete("/delete/:id", authWare, board.deleteBoard);


module.exports = router;