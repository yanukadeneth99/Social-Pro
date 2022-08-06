const queue = require("../config/kue");

const passMailer = require("../mailers/reset_password_mailer");

queue.process("passwordreset", function (job, done) {
  passMailer.resetPass(job.data);

  done();
});
