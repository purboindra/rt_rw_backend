export const VERIFICATION_TOKEN_EXPIRES_IN_MINUTES = 30;

export const SMTP_HOST = process.env.SMTP_HOST || "smtp.ethereal.email";
export const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587", 10);
export const SMTP_USER = process.env.SMTP_USER || "purboyndra@ethereal.email";
export const SMTP_PASS = process.env.GMAIL_APP_PASSWORD || "Z4aXR8RfjdS4otWN";
export const SMTP_FROM_ADDRESS = process.env.SMTP_FROM_ADDRESS || '"RT RW Community" <purboyndra@ethereal.email>';
