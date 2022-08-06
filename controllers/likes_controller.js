const Like = require("../models/like");
const Post = require("../models/post");
const Comment = require("../models/comment");
const logger = require('../logger');

// When User Clicks Like
module.exports.toggleLike = async function (req, res) {
  try {

    // likes/toggle/?id=abcd&type=Post
    let likeable; //Is the Variable that contains the object Post or Comment with all the likes populated
    let deleted = false;

    //Type Post
    if(req.query.type == 'Post'){
      likeable = await Post.findById(req.query.id).populate('likes');   
    }
    // Type Comment
    else if(req.query.type == 'Comment'){
      likeable = await Comment.findById(req.query.id).populate('likes');
    } 
    // Type Neither
    else {
      //TODO Display Error Message here
    }

    // Check if a like already exists
    let existingLike = await Like.findOne({
      user: req.user._id,
      likeable: req.query.id,
      onModel: req.query.type,
    })

    // Like already Exists
    if(existingLike){
      likeable.likes.pull(existingLike._id);
      likeable.save();
      existingLike.remove();
      deleted = true;
    }
    // Make a new Like
    else {
      let newLike = await Like.create({
        user: req.user,
        likeable: req.query.id,
        onModel: req.query.type,
      });

      likeable.likes.push(newLike._id);
      likeable.save();
    }

    return res.status(200).json({
      message: "Request successful!",
      data: {
        deleted:deleted
      }
    })

  } catch (err) {
    logger.error(`Error in Toggling Like : ${err}`);
    return res.json(500, {
      message: "Internal Server Error",
    });
  }
};
