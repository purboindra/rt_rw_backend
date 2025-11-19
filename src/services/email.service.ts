import nodemailer from "nodemailer";
import { logger } from "../logger";
import { SMTP_FROM_ADDRESS, SMTP_HOST, SMTP_PASS, SMTP_PORT, SMTP_USER } from "../utils/constants";

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

export const sendVerificationEmail = async (recipientEmail: string, verificationCode: string) => {
  const mailOptions = {
    from: SMTP_FROM_ADDRESS,
    to: recipientEmail,
    subject: "Verifikasi Email Kamu",
    text: `Kode verifikasi email kamu adalah: ${verificationCode}`,
    html: `
      <h1>Verifikasi Email Kamu</h1>
      <p>Terima kasih telah menggunakan aplikasi CommApp. Masukkan kode berikut di aplikasi untuk memverifikasi email kamu:</p>
      <h2 style="font-size: 24px; letter-spacing: 4px; text-align: center;">${verificationCode}</h2>
    `,
  };

  await transporter.sendMail(mailOptions);
  logger.info(`Verification email sent to ${recipientEmail}`);
};
