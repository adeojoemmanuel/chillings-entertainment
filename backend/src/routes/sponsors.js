import express from 'express';
import { getSponsors, applyForSponsorship } from '../controllers/sponsorController.js';

const router = express.Router();

/**
 * @swagger
 * /api/sponsors:
 *   get:
 *     summary: Get all approved sponsors
 *     tags: [Sponsors]
 *     responses:
 *       200:
 *         description: List of approved sponsors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sponsors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       company_name:
 *                         type: string
 *                       contact_name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       website:
 *                         type: string
 *                       logo_url:
 *                         type: string
 *                       sponsorship_level:
 *                         type: string
 *       500:
 *         description: Server error
 */
router.get('/', getSponsors);

/**
 * @swagger
 * /api/sponsors/apply:
 *   post:
 *     summary: Apply to become a sponsor
 *     tags: [Sponsors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - company_name
 *               - contact_name
 *               - email
 *             properties:
 *               company_name:
 *                 type: string
 *                 example: Acme Corporation
 *               contact_name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@acme.com
 *               phone:
 *                 type: string
 *                 example: +234 703 123 4567
 *               website:
 *                 type: string
 *                 example: https://acme.com
 *               description:
 *                 type: string
 *                 example: We are a leading technology company...
 *               logo_url:
 *                 type: string
 *                 example: https://acme.com/logo.png
 *               sponsorship_level:
 *                 type: string
 *                 enum: [platinum, gold, silver, bronze, partner]
 *                 example: gold
 *     responses:
 *       201:
 *         description: Application submitted successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post('/apply', applyForSponsorship);

export default router;

