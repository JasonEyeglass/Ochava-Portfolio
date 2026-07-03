import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: parseInt(process.env.PORT, 10) || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  emailFrom: process.env.EMAIL_FROM || 'portfolio@example.com',
  emailTo: process.env.EMAIL_TO || 'karl@example.com',
  recaptchaSecretKey: process.env.RECAPTCHA_SECRET_KEY || '',
};

export function isEmailConfigured() {
  return !!(env.smtp.host && env.smtp.user && env.smtp.pass);
}
