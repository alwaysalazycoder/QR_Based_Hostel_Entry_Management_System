const express = require('express');
const { createPost, getPost, updatePost, deletePost } = require('../controller/postController');
const router = express.Router();
const { isAuthenticatedUser } = require("../middleware/auth");



router.route("/create/post").post(isAuthenticatedUser, createPost);
router.route("/get/post").get(getPost);
router.route("/update/post/:id").put(updatePost).delete(deletePost);

module.exports = router;