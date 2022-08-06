const logger = require("../logger");
const Post = require("../models/post");
const Comment = require("../models/comment");
const Like = require('../models/like');

// Creating Post
module.exports.createPost = async function (req, res) {
  try {
    let post = await Post.create({
      content: req.body.content,
      user: req.user._id,
    });

    if (req.xhr) {

      await Post.populate(post, {path:'user', select:'name'})

      return res.status(200).json({
        data: {
          post: post,
        },
        message: "Post Created!",
      });
    }

    req.flash("success", "Created Post Success");
    return res.redirect("back");
  } catch (err) {
    req.flash("success", "Could not create post");
    logger.error(`Error with Creating Post at posts_controller.js : ${err}`);
    return;
  }
};

// Deleting Posts
module.exports.deletePost = async function (req, res) {
  try {
    let post = await Post.findById(req.params.id);

    //Same user with post and logged in
    if (post.user == req.user.id) {

      await Like.deleteMany({likeable:post, onModel: 'Post'});
      await Like.deleteMany({_id: {$in: post.comments}});

      post.remove();

      await Comment.deleteMany({
        post: req.params.id,
      });

      if (req.xhr) {
        return res.status(200).json({
          data: {
            post_id: req.params.id,
          },
          message: "Post deleted",
        });
      }

      req.flash("success", "Successfully deleted post");
      return res.redirect("/");
    } else {
      req.flash("error", "Something went wrong");
      return res.redirect("/");
    }
  } catch (err) {
    req.flash("error", "Could not delete post");
    logger.error(`Error when deleting post at posts_controller.js : ${err}`);
    return;
  }
};
