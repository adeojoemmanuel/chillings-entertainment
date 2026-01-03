import express from 'express';
import { checkGuests } from '../controllers/vettingController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

/**
 * @swagger
 * /api/vetting/check-guests:
 *   post:
 *     summary: Validate invited guests/celebrities based on historical data
 *     tags: [Vetting]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VettingRequest'
 *     responses:
 *       200:
 *         description: Vetting results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/VettingResult'
 *                 summary:
 *                   type: object
 *                   properties:
 *                     total_guests:
 *                       type: integer
 *                     verified_count:
 *                       type: integer
 *                     realistic_count:
 *                       type: integer
 *                     verification_rate:
 *                       type: number
 *                       format: float
 *                     all_verified:
 *                       type: boolean
 *                     all_realistic:
 *                       type: boolean
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/check-guests', checkGuests);

export default router;
