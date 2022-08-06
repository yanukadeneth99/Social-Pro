{
  $(document).ready(function () {
    let fpasslink = $("#fpass");
    let emailadd = $("#uemail");

    fpasslink.click(function (e) {
      e.preventDefault();

      let email = emailadd.val();

      // Email Field is not null
      if (email) {

        // Check if what is entered is an email
        if (!isEmail(email)) {
          flash("error", "Please enter a valid email");
        } else {

          // Ajax Request to Reset Password
          $.ajax({
            type: "post",
            url: "/users/resetpassword/",
            data: {
              emailaddress: email,
            },
            success: function (data) {
              flash("success", `Reset email sent to ${email}`);
            },
            error: function (err) {
              flash("error", "Shit : Something went wrong");
            },
          });
        }
      }
      // Nothing Entered in the email
      else {
        flash("error", "Please enter an email!");
      }
    });
  });

  // Function which returns a boolean based on whether it is an email
  function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,6})+$/;
    return regex.test(email);
  }
}
