import nodemailer from 'nodemailer';
import { env, isEmailConfigured } from '../config/env.js';

let transporter = null;

function getTransporter() {
  if (!isEmailConfigured()) {
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.port === 465,
      auth: {
        user: env.smtp.user,
        pass: env.smtp.pass,
      },
    });
  }

  return transporter;
}

export async function sendContactEmail({ name, email, message }) {
  const transport = getTransporter();

  if (!transport) {
    console.log('[email] SMTP not configured — logging submission instead:');
    console.log({ name, email, message });
    return { simulated: true };
  }

  const mailOptions = {
    from: env.emailFrom,
    to: env.emailTo,
    replyTo: email,
    subject: `Portfolio Contact: ${name}`,
    text: [
      `Name: ${name}`,
      `Email: ${email}`,
      '',
      'Message:',
      message,
    ].join('\n'),
    html: `
      <h2>New portfolio contact form submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
      <hr />
      <p>${message.replace(/\n/g, '<br />')}</p>
    `,
  };

  await transport.sendMail(mailOptions);
  return { sent: true };
}
