const nodemailer = require("nodemailer");
require("dotenv").config();

async function testMail() {
  console.log("Creating transport with:", {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    // not logging password for security
  });

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"SpiderNode Test" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, // send to self
      subject: "Test Email from Script",
      text: "This is a test email to verify SMTP settings.",
    });
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

testMail();
