const express = require("express");
const router = express.Router();

const homeController = require("../controllers/home_controller");
const passport = require("../config/passport-local-strategy");

// Loading Home Page for Home/Root
router.get("/", passport.checkAuthentication, homeController.loadPage);

// Transfer all /users to users.js
router.use("/users", require("./users"));

// Transfer all /posts to post.js
router.use("/posts", require("./posts"));

// Transfer all /comments to comments.js
router.use("/comments", require("./comments"));

// Transfer all /likes into likes.js
router.use('/likes', require('./likes'));

// Transfer all /apis inside apis
router.use('/api', require('./api'));

module.exports = router;
