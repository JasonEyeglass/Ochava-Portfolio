import { Router } from 'express';
import { handleContactSubmission } from '../controllers/contactController.js';
import { contactRateLimiter } from '../middleware/rateLimiter.js';
import {
  contactValidationRules,
  validateContactForm,
} from '../middleware/validateContactForm.js';

const router = Router();

router.post(
  '/',
  contactRateLimiter,
  contactValidationRules,
  validateContactForm,
  handleContactSubmission
);

export default router;
