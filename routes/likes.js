const express = require("express");
const router = express.Router();
const likesController = require('../controllers/likes_controller');

// When user likes a post/comment
router.post('/toggle', likesController.toggleLike);

module.exports = router;