const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: "",
    pass: "",
  },
});

let mailOptions = {
  from: "henryhe1123@gmail.com",
  to: "henryhe1123@gmail.com, hkamin@qualiteas.ca",
  subject: "testing1",
  text: "it is working fine",
};

transporter.sendMail(mailOptions, (err, data) => {
  if (err) {
    console.log("Error occur: ", err);
  } else {
    console.log("Mail sent!!!");
  }
});
