const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser,
    logOut,
    registerAdmin,
    loginAdmin,
    logOutAdmin
} = require("../controller/userController");


// user routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logOut);


// admin routes
router.route("/admin/register").post(registerAdmin);
router.route("/admin/login").post(loginAdmin);
router.route("/admin/logout").get(logOutAdmin);

module.exports = router;