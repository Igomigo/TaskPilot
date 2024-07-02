// Authentication routes

const express = require("express");
const router = express.Router();
const authentication = require("../controllers/authEngine");

// POST request to register a user
router.post("/register", authentication.register);

// POST request to log a user in
router.post("/login", authentication.login);


module.exports = router;