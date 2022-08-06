const User = require("../models/user");
const logger = require("../logger");
const fs = require("fs");
const path = require("path");
const queue = require('../config/kue');
const { createHmac } = require("crypto");
const passMailer = require('../mailers/reset_password_mailer');
const passWorker = require('../workers/password_reset_worker');

// Load Profile Page
module.exports.loadPage = function (req, res) {
  User.findById(req.params.id, (err, user) => {

    if(err){
      logger.error(`Error loading Profile Page : ${err}`);
      return res.redirect("/");
    }

    res.render("user_profile", {
      title: "User Profile",
      profile_user: user,
    });
  });
};

// Load User Signin Page
module.exports.loadUserSignInPage = function (req, res) {
  res.render("user_signin", {
    title: "Meme Form | Sign In",
  });
};

// Load User Signup Page
module.exports.loadUserSignUpPage = function (req, res) {
  res.render("user_signup", {
    title: "Meme Form | Sign Up",
  });
};

// Create User from the Signup.ejs
module.exports.createUser = async function (req, res) {
  // Checking whether the password and confirm password match, else return
  if (req.body.upass != req.body.upassconfirm) {
    req.flash("error", "Please enter the same passwords");
    return res.redirect("back"); //TODO Put a correct response for this
  }

  // Found User to see if it exists
  let alreadyuser = await User.findOne({ email: req.body.uemail });

  // If User Doesn't Exist create account
  if (!alreadyuser) {

    const hash = await createHmac("sha256", (Math.random() + 1).toString(36).substring(7)).digest("hex" ); //Random New Hash for ResetPass

    let user = await User.create({
      email: req.body.uemail,
      password: req.body.upass,
      name: req.body.uname,
      resetpass: hash,
    });
    req.flash("success", "Created User successfully!");
    logger.info(`Created User : ${user}`);
    return res.redirect("/users/signin");
  }
  // If User exists
  else {
    req.flash("error", "User already exists!");
    return res.redirect("back"); //TODO Do a proper response for this
  }
};

// Login user from signin.ejs and Create session
module.exports.login = function (req, res) {
  req.flash("success", "Logged in Successfully!");
  return res.redirect("/");
};

// Sign out user
module.exports.SignOut = function (req, res) {
  try {
    req.logout();
    req.flash("success", "Logged out!");
    return res.redirect("/users/signin");
  } catch (err) {
    if (err) {
      req.flash("error", "Error when logging out!");
      logger.error(
        `Error When destroying Session in users_controller.js : ${err}`
      );
      return;
    }
  }
};

// Update Account Details of user
module.exports.updateProfile = async function (req, res) {
  // Same user edited
  if (req.user.id == req.params.id) {
    try {
      let user = await User.findByIdAndUpdate(req.params.id);

      User.uploadedAvatar(req, res, (err) => {
        if (err) {
          console.error(err);
        }

        user.name = req.body.name;
        user.email = req.body.email;
        user.password = req.body.password;

        if (req.file) {
          if (user.avatar) {
            if (fs.existsSync(path.join(__dirname, "..", user.avatar)))
              fs.unlinkSync(path.join(__dirname, "..", user.avatar));
          }
          user.avatar = User.avatarPath + "/" + req.file.filename;
        }

        user.save();
      });

      req.flash("success", "Updated User Successfully!");
      return res.redirect("back");

    } catch (error) {
      req.flash("error", "Error updating profile");
      return res.redirect("back");
    }
  } else {
    req.flash("error", "Unauthorized access!");
    return res.status(401).send("Unauthorized");
  }
};

// User Triggers the Reset Password
module.exports.resetPass = async function (req, res) {
  if (req.xhr) {
    try {
      //Find User Based on Email Address (Get only the Username and Reset Password)
      let user = await User.findOne({ email: req.body.emailaddress }).select("email resetpass name");

      // User doesn't exist in the database
      if (!user) {
        //TODO Catch the response code in the ajax send and display email doesnt exist
        return res.status(200).json({
          message: "User doesn't exist in the database",
        });
      }

      //User exists so send Password Reset Email
      await queue.create("passwordreset", user).save();

      logger.info(`Sent Password Request Email to ${user.email}`);

      return res.status(200).json({
        message: "Successfully sent email",
      });

    } catch (err) {
      logger.error(`Error in triggering Reset Password : ${err}`);

      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }

  return res.redirect(500, "/users/signin");
};

// User gets an email with the reset password
module.exports.resetPassProcess = async function(req, res){

  // Find Whether User exists on the email and resettoken
  let user = await User.findOne({ resetpass: req.query.resettoken, email: req.query.email }).select('_id email resetpass name');

  if (!user) {
    return res.redirect(500, "/users/signin"); //TODO Put a proper response code so that the front end can handle it.
  }

  return res.render("forgot_password", {
    title: "User Reset Password",
    user: user,
  });
}

// User finishes typing the password and the password is changed
module.exports.resetPassFinal = async function (req, res) {
  if (req.body.upass === req.body.upassconfirm) {
    
    let user = await User.findOne({_id:req.body.uid, resetpass : req.body.utoken});

    // User doesn't exist
    if (!user) {
      return res.status(500).json({
        message: "User not found or Reset Token incorrect",
      });
    }

    const hash = await createHmac("sha256", (Math.random() + 1).toString(36).substring(7)).digest("hex"); //Generating New Hash
    user.resetpass = hash;
    user.password = req.body.upassconfirm;

    user.save();

    logger.info(`Reset Password of User : ${user.email}`);
    return res.redirect("/users/signin");  
  }
  // Passwords do not match
  else {
    return res.status(500).json({
      message: "Incorrect Passwords!",
    });
  }
};
