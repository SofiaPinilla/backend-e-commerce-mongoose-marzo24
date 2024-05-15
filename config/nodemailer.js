const nodemailer = require("nodemailer");
require("dotenv").config()
const {USER, PASS} = process.env
console.log(USER,PASS)
let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: USER,
    pass: PASS,
  },
});

module.exports = transporter;
