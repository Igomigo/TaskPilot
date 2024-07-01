// Handles routing

const express = require("express");
const router = express.Router();
const authWare = require("../middlewares/authWare");
const authentication = require("../controllers/authEngine");

// POST request to register a user
router.post("/register", authentication.register);

// POST request to log a user in
router.post("/login", authentication.login);


module.exports = router;