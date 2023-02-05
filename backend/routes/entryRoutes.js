



const express = require('express');
const router = express.Router();

const {createEntry, getAllEntry, getAllEntryby} = require("../controller/entryController");
const {isAuthenticatedUser} = require("../middleware/auth");

router.route("/mark/entry").post(isAuthenticatedUser,createEntry);
router.route("/get/entry").get(getAllEntry);
router.route("/get/entry/d").get(getAllEntryby);


module.exports = router;
