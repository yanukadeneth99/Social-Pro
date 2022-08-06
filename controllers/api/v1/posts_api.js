const Post = require('../../../models/post');
const logger = require('../../../logger');
const Comment = require('../../../models/comment');

module.exports.index = async function (req, res) {

  let posts = await Post.find({})
  .sort("-createdAt")
  // Populate the user of each post
  .populate("user")
  .populate({ path: "comments", populate: { path: "user" }, });

  return res.status(200).json({
    message: "List of posts",
    posts: posts,
  });
};

module.exports.deletePost = async function (req, res) {
  try {
    let post = await Post.findById(req.params.id);

    //Same user with post and logged in
    if (post.user == req.user.id) {
      post.remove();

      await Comment.deleteMany({
        post: req.params.id,
      });

      return res.status(200).json({
        message: "Post and associated comments deleted successfully!",
      });
    } else {
      return res.status(401).json({
        message: "You cannot delete this post!",
      });
    }
  } catch (err) {
    logger.error(`Error when deleting post at posts_controller.js : ${err}`);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
