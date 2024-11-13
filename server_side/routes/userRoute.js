// User Route

const express = require("express");
const user = require("../controllers/user");
const authWare = require("../middlewares/authWare");

const router = express.Router();

/**
 * GET request to retrieve user data
 * url: http://localhost:3000/u/account
 */
router.get("/account", authWare, user.getUser);

/**
 * PUT request to update user data
 * url: http://localhost:3000/u/update
 */
router.put("/update", authWare, user.updateUser);


module.exports = router;