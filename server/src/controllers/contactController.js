import { sendContactEmail } from '../services/emailService.js';

export async function handleContactSubmission(req, res, next) {
  try {
    const { name, email, message } = req.body;

    const result = await sendContactEmail({ name, email, message });

    res.status(200).json({
      success: true,
      message: result.simulated
        ? 'Message received (email delivery simulated in development).'
        : 'Message sent successfully.',
    });
  } catch (err) {
    err.status = 500;
    err.message = 'Failed to send email. Please try again later.';
    next(err);
  }
}
