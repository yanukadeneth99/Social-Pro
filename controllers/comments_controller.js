const Comment = require("../models/comment");
const Post = require("../models/post");
const logger = require("../logger");
const queue = require('../config/kue');
const commentsMailer = require('../mailers/comments_mailer');
const commentEmailWorker = require('../workers/comment_email_worker');
const Like = require('../models/like');

// Creating Comment
module.exports.createComment = async function (req, res) {
  try {
    let post = await Post.findById(req.body.post);

    if(post){
      let comment = await Comment.create({
        content: req.body.content,
        post: req.body.post,
        user: req.user._id,
      });
      post.comments.push(comment);
      post.save();

      await Comment.populate(comment, { path: "user", select: "name email" });

      // commentsMailer.newComment(comment); //Send Email 
      let job = queue.create("emails", comment).save(function (err) {
        if (err) {
          logger.error(`Error in creating a queue : ${err}`);
          return;
        }
      });


      if (req.xhr) {
        return res.status(200).json({
          data: {
            comment: comment,
          },
          message: "Comment created!",
        });
      }

      req.flash("success", "Successfully commented!");

      res.redirect("/");
    }
  } catch (err) {
    req.flash("error", "Error creating the comment!");
    logger.error(
      `Error when creating comment at comments_controller.js : ${err}`
    );
    return res.redirect("/");
  }
};

// Deleting Comments
module.exports.deleteComment = async function (req, res) {
  try {
    let comment = await Comment.findById(req.params.id);

    // Checking if owner of the comment is requesting the delete
    if (comment.user == req.user.id) {
      let postId = comment.post;
      comment.remove();

      await Post.findByIdAndUpdate(postId, {
        $pull: { comments: req.params.id },
      });

      await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});

      if(req.xhr){
        return res.status(200).json({
          data: {
            comment_id: req.params.id,
          },
          message: "Post deleted",
        });
      }

      req.flash("success", "Successfully deleted the comment");
      return res.redirect("/");
    }
    // Not the owner
    else {
      req.flash("error", "Unauthorized access to delete the comment");
      return res.redirect("/");
    }
  } catch (err) {
    req.flash("error", "Error when deleting comment");
    logger.error(
      `Error when creating comment at comments_controller.js : ${err}`
    );
    return res.redirect("/");
  }
};
