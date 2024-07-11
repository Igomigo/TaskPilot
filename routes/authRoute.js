// Authentication routes

const express = require("express");
const router = express.Router();
const authentication = require("../controllers/authEngine");

// POST request to register a user
// url: http://localhost:3000/auth/register
router.post("/register", authentication.register);

// POST request to log a user in
// url: http://localhost:3000/auth/login
router.post("/login", authentication.login);


module.exports = router;