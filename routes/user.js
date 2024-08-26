const express = require("express");
const router = express.Router();
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");


router.route("/login")
.get(userController.renderLogin)
.post(saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: '/login', 
            failureFlash: true
    }), 
    userController.loginUser
);

router.route("/signup")
.get(userController.renderSignup)
.post(userController.signupUser);


router.get("/logout", userController.logout);

module.exports = router;