// Board routes

const board = require("../controllers/board");
const authWare = require("../middlewares/authWare");
const permission = require("../middlewares/boardPermissions");
const members = require("../controllers/member");
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
 * url: http://localhost:3000/b/:boardId
 */
router.get("/:boardId", authWare, permission.permitUser, board.getBoardById);

/**
 * PUT request to update a particular board data
 * url: http://localhost:3000/b/update/:id
 */
router.put("/update/:id", authWare, board.updateBoard);

/**
 * POST request to add a user to the board
 * url: http://localhost:3000/b/:boardId/add-member
 */
router.post(
    "/:boardId/add-member", authWare,
    permission.addRemDelPermission, members.addMember
);

/**
 * GET request to retrieve all members for a board
 * url: http://localhost:3000/b/:boardId/members
 */
router.get("/:boardId/members", authWare, members.getBoardMembers);

/**
 * DELETE request to remove a user from the board
 * url: http://localhost:3000/b/:boardId/:userId
 */
router.delete(
    "/:boardId/:memberUserId", authWare,
    permission.addRemDelPermission, members.removeMember
);

/**
 * DELETE request to delete a particular board
 * url: http://localhost:3000/b/:boardId
 */
router.delete(
    "/:boardId", authWare,
    permission.addRemDelPermission, board.deleteBoard
);


module.exports = router;