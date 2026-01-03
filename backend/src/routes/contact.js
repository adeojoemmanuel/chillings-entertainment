import express from 'express';
import { sendContactMessage } from '../controllers/contactController.js';

const router = express.Router();

/**
 * @swagger
 * /api/contact:
 *   post:
 *     summary: Send a contact form message
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - subject
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               subject:
 *                 type: string
 *                 example: General Inquiry
 *               message:
 *                 type: string
 *                 example: I have a question about your services.
 *     responses:
 *       200:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Your message has been sent successfully. We will get back to you soon!
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post('/', sendContactMessage);

export default router;

