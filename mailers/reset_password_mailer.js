const nodeMailer = require('../config/nodemailer');
const logger = require('../logger');

exports.resetPass = (user) => {
  let htmlString = nodeMailer.renderTemplate({user:user}, '/passwordreset/password_reset.ejs'); //TODO Use Template

  nodeMailer.transporter.sendMail({
    from: "Yanuka Deneth 👻",
    to: user.email,
    subject: "Password Reset Requested",
    html: htmlString,
  },
  (err, info)=>{
    if (err) {
      logger.error(`Error in sending Email : ${err}`);
      return;
    }

    logger.info(`Password Reset Email sent to ${user.email}`);
    return;
  })
}