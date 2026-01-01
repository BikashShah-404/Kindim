import nodemailer from "nodemailer";

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
    html: ` <table width="200" height="100" align="center" border="0" cellpadding="0" cellspacing="0" 
       style="border:2px solid black; background-color:black; border-radius:12px;">
  <tr>
    <td align="center" valign="middle" style="color:white; font-size:16px; font-weight:bold;">
      ${body}
    </td>
  </tr>
</table>
          `,
    replyTo: "shahbikash4659@gmail.com",
  });

  return info.messageId;
};
