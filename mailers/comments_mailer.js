const nodeMailer = require('../config/nodemailer');
const logger = require("../logger");

// Exporting Method
exports.newComment = (comment) => {
  let htmlString = nodeMailer.renderTemplate({comment:comment}, '/comments/new_comment.ejs');

  nodeMailer.transporter.sendMail(
    {
      from: "Yanuka Deneth 👻",
      to: comment.user.email,
      subject: "New Comment Published!",
      html: htmlString,
    },
    (err, info) => {
      if (err) {
        logger.error(`Error in sending Email : ${err}`);
        return;
      }

      logger.info(`Email sent to ${comment.user.email}`);
      return;
    }
  );
};