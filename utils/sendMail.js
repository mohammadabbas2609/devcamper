const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST_NAME,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendMail = async option => {
  const message = {
    from: `${process.env.FROM_EMAIL} - ${process.env.FROM_NAME}`,
    to: option.email,
    subject: option.subject,
    text: option.message,
  };

  const info = await transporter.sendMail(message);

  console.log(info.messageId + "Mail Sent");
};

module.exports = sendMail;
