import nodemailer from "nodemailer";
import { asyncHandler } from "../utils/asyncHandler.js";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const mailer = async (email, subject, body) => {
  const info = await transporter.sendMail({
    from: "Kindim <shahbikash4659@gmail.com>",
    to: email,
    subject,
    html: `<b>${body}</b>`,
    replyTo: "shahbikash4659@gmail.com",
  });

  return info.messageId;
};
