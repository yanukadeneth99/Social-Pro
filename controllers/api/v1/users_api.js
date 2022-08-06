const User = require('../../../models/user');
const jwt = require('jsonwebtoken');
const logger = require('../../../logger');
const env = require('../../../config/environment');

// Login user from API
module.exports.login = async function (req, res) {
  try {
    let user = await User.findOne({ email: req.body.email });

    if(!user || user.password != req.body.password){
      return res.status(422).json({
        message:"Invalid Username or Password",
      })
    }

    return res.status(200).json({
      message: "Sign in successful with token",
      data: {
        token: jwt.sign(user.toJSON(), env.jwt_secret, { expiresIn: "1000000" }), //Token
      },
    });

  } catch (err) {
    logger.error(`Error finding user : ${err}`);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};