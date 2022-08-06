const express = require("express");
const router = express.Router();
const passport = require("passport");

const postsController = require("../controllers/posts_controller");

// Create Post
router.post("/createpost", passport.checkAuthentication, postsController.createPost);

// Delete Post
router.get("/deletepost/:id", passport.checkAuthentication, postsController.deletePost);

module.exports = router;
