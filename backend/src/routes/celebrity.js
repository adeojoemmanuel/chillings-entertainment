import express from 'express';
import {
  requestCelebrityService,
  getUserCelebrityRequests
} from '../controllers/celebrityController.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /api/celebrity/request:
 *   post:
 *     summary: Request celebrity services for an event
 *     tags: [Celebrity Services]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - planner_name
 *               - planner_email
 *               - event_title
 *               - event_date
 *               - event_location
 *             properties:
 *               event_id:
 *                 type: string
 *                 format: uuid
 *                 description: Optional - Link to existing event
 *               planner_name:
 *                 type: string
 *                 example: "John Doe"
 *               planner_email:
 *                 type: string
 *                 format: email
 *                 example: "john@example.com"
 *               planner_phone:
 *                 type: string
 *                 example: "+1234567890"
 *               event_title:
 *                 type: string
 *                 example: "Summer Music Festival 2024"
 *               event_date:
 *                 type: string
 *                 format: date
 *                 example: "2024-07-15"
 *               event_time:
 *                 type: string
 *                 format: time
 *                 example: "18:00"
 *               event_location:
 *                 type: string
 *                 example: "Central Park, New York"
 *               city_id:
 *                 type: string
 *                 format: uuid
 *               event_type:
 *                 type: string
 *                 example: "concert"
 *               expected_attendees:
 *                 type: integer
 *                 example: 5000
 *               budget_range:
 *                 type: string
 *                 enum: [low, medium, high, premium]
 *                 example: "high"
 *               celebrity_preferences:
 *                 type: string
 *                 example: "Top hip-hop artists or A-list actors"
 *               special_requirements:
 *                 type: string
 *                 example: "Need celebrity to perform for 30 minutes"
 *     responses:
 *       201:
 *         description: Celebrity service request submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 request:
 *                   type: object
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/request', optionalAuth, requestCelebrityService);

/**
 * @swagger
 * /api/celebrity/my-requests:
 *   get:
 *     summary: Get all celebrity service requests for the authenticated user
 *     tags: [Celebrity Services]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's celebrity service requests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 requests:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Unauthorized
 */
router.get('/my-requests', authenticateToken, getUserCelebrityRequests);

export default router;

