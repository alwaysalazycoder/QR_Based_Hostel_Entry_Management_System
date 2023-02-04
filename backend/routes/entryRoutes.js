



const express = require('express');
const router = express.Router();

const {createEntry} = require("../controller/entryController");
const {isAuthenticatedUser} = require("../middleware/auth");

router.route("/markEntry").post(isAuthenticatedUser,createEntry);

module.exports = router;