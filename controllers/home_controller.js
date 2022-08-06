const { loggers } = require("winston");
const Post = require("../models/post");
const User = require("../models/user");

// Load Home Page
module.exports.loadPage = async function (req, res) {
  try {
    let posts = await Post.find({})
      .sort("-createdAt")
      // Populate the user of each post
      .populate("user")
      .populate({
        path: "comments",
        populate: { path: "user" },
        populate: { path: "likes" },
      })
      .populate("likes");

    let users = await User.find({});

    return res.render("home", {
      title: "Social Pro",
      posts_list: posts,
      all_users: users,
    });
  } catch (err) {
    req.flash("error", "Error loading Home Page!");
    loggers.error(`Error when loading Page at home_controller.js : ${err}`);
    return;
  }
};
