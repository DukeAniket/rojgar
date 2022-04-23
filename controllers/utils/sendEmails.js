const nodemailer = require("nodemailer");
require("dotenv").config();
const sgMail = require("@sendgrid/mail");
const sendEmail = async ({ to, subject, html }) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to, // Change to your recipient
    from: process.env.SENDGRID_API_EMAIL, // Change to your verified sender
    subject: "Sending with SendGrid is Fun",
    text: "MIkU wants you to verify your Alist account",
    html,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};

module.exports = sendEmail;
