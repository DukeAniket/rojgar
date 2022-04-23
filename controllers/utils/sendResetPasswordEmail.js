const sendEmail = require("./sendEmails");

const sendVerificationEmail = async ({ name, email, token, origin }) => {
  const resetURL = `${origin}/reset-Password?token=${token}&email=${email}`;

  const message = `<p>Please follow the link to reset password : 
  <a href="${resetURL}">Reset Password</a> </p>`;

  return sendEmail({
    to: email,
    subject: "Reset Alist Password",
    html: `<h4> Hello, ${name}</h4>
    ${message}
    `,
  });
};

module.exports = sendVerificationEmail;
