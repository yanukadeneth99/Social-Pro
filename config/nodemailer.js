const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
const logger = require("../logger");
const env = require("./environment");

try {
  // Configuration for the Service
  let transporter = nodemailer.createTransport(env.smtp);

  // Rendering Template to be sent as HTML
  let renderTemplate = (data, relativePath) => {
    let mailHTML;

    ejs.renderFile(
      path.join(__dirname, "../views/mailers", relativePath),
      data,
      function (err, template) {
        if (err) {
          logger.error(`Error in rendering template : ${err}`);
          return;
        }

        mailHTML = template;
      }
    );

    return mailHTML;
  };

  module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate,
  };
} 
catch (err) {
  logger.error(`Error using nodemailer at nodemailer.js : ${err}`);
}
