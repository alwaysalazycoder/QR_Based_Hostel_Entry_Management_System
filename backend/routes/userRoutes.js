const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser,
    logOut,
    registerAdmin,
    loginAdmin,
    logOutAdmin,
    forgotPassword,
    resetPassword
} = require("../controller/userController");


// user routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logOut);
router.route("/password/forgot").post(forgotPassword("user"));
router.route("/password/reset/:token").put(resetPassword("user"));


// admin routes
router.route("/admin/register").post(registerAdmin);
router.route("/admin/login").post(loginAdmin);
router.route("/admin/logout").get(logOutAdmin);
router.route("/admin/password/forgot").post(forgotPassword("admin"));
router.route("/admin/password/reset/:token").put(resetPassword("admin"));


module.exports = router;