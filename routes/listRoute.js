// List Routes

const list = require("../controllers/list");
const express = require("express");
const authWare = require("../middlewares/authWare");
const router = express.Router();

/**
 * POST request to create a new list
 * url: http://localhost:3000/b/:boardId/list
 */
router.post("/:boardId/list", authWare, list.createList);

/**
 * GET request to retrieve a list within a board
 * url: http://localhost:3000/b/lists
 */
router.get("/lists", authWare, list.getLists);

/**
 * PUT request to update a particular list data
 * url: http://localhost:3000/b/list/:id
 */
router.put("/list/:id", authWare, list.updateList);

/**
 * DELETE request to delete a particular list data
 * url: http://localhost:3000/b/list/:id
 */
router.delete("/list/:id", authWare, list.deleteList);


module.exports = router;