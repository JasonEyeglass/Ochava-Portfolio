import { useState } from 'react';
import { validateContactForm } from '../../utils/validators';
import { submitContactForm } from '../../services/api';
import { SendIcon } from '../Icons/Icons';
import styles from './Contact.module.css';

const INITIAL_FORM = { name: '', email: '', message: '', website: '' };

export default function ContactForm() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage('');

    const { isValid, errors: validationErrors } = validateContactForm(form);
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setStatus('loading');
    try {
      await submitContactForm(form);
      setStatus('success');
      setStatusMessage("Message sent! I'll get back to you soon.");
      setForm(INITIAL_FORM);
      setErrors({});
    } catch (err) {
      setStatus('error');
      setStatusMessage(err.message);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={`${styles.field} ${styles.honeypot}`} aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          type="text"
          id="website"
          name="website"
          value={form.website}
          onChange={handleChange}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="name">Full Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="John Doe"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <span id="name-error" className={styles.error} role="alert">
            {errors.name}
          </span>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          id="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="john@example.com"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <span id="email-error" className={styles.error} role="alert">
            {errors.email}
          </span>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Your project details..."
          rows={5}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-error' : undefined}
        />
        {errors.message && (
          <span id="message-error" className={styles.error} role="alert">
            {errors.message}
          </span>
        )}
      </div>

      <button
        type="submit"
        className={styles.submit}
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Sending...' : 'Send Message'}
        {status !== 'loading' && <SendIcon />}
      </button>

      {statusMessage && (
        <p
          className={`${styles.status} ${status === 'success' ? styles.statusSuccess : styles.statusError}`}
          role="status"
        >
          {statusMessage}
        </p>
      )}
    </form>
  );
}
