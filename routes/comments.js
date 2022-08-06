const express = require("express");
const router = express.Router();
const passport = require("passport");

const commentsController = require("../controllers/comments_controller");

// Create Comment for that post
router.post("/createcomment", passport.checkAuthentication, commentsController.createComment);

// Delete Comments
router.get("/deletecomment/:id", passport.checkAuthentication, commentsController.deleteComment);

module.exports = router;
