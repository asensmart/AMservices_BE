const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.NODE_EMAIL,
    pass: process.env.NODE_EMAIL_APP_CODE,
  },
});

exports.sendEmail = (to_email, subject, htmlBody, callback) => {
  try {
    var mailOptions = {
      to: to_email,
      subject: subject,
      html: htmlBody,
      // attachments: [
      //   {
      //     filename: "logo.png",
      //     path: __dirname + "/public/logo.png",
      //     cid: "logo",
      //   },
      // ],
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("----------------transporter Mail error----------");
        console.log(error);
        console.log("----------------------------------");
      }
      callback(true);
    });
  } catch (e) {
    console.log("----------------mail error----------");
    console.log(e);
    console.log("----------------------------------");
    callback(false);
  }
};