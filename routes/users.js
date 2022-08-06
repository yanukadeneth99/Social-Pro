const express = require("express");
const router = express.Router();
const passport = require("passport");

const usersController = require("../controllers/users_controller");

// Profile Page
router.get( "/profile/:id", passport.checkAuthentication, usersController.loadPage);

// Change User Info
router.post("/update-profile/:id", passport.checkAuthentication, usersController.updateProfile);

// Sign In Page
router.get("/signin", passport.alreadyAuthenticated, usersController.loadUserSignInPage);

// Sign Up Page
router.get("/signup", passport.alreadyAuthenticated, usersController.loadUserSignUpPage);

// Create User
router.post("/createuser", usersController.createUser);

// Login User using passport js as a middleware to authenticate
router.post("/login", passport.authenticate("local", { failureRedirect: "/users/signin" }), usersController.login);

// Logout User
router.get("/signout", usersController.SignOut);

// Authenticate using google
router.get('/auth/google', passport.authenticate('google', {scope:['profile', 'email']}));

// Call back Route for Google Authentication
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/users/signin'}), usersController.login);

// Reset Password Process
router.post("/resetpassword", usersController.resetPass); // User Triggers the Reset Pass
router.get("/passwordreset", usersController.resetPassProcess); // User clicks the email
router.post("/passwordresetfinal", usersController.resetPassFinal); // User clicks the email

module.exports = router;
