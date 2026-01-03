import express from 'express';
import {
  createEvent,
  getUserEvents,
  getEventById,
  getPublicEventById,
  recommendServices,
  addToCart,
  addAllToCart,
  removeFromCart,
  getCheckoutPreview,
  checkout,
  getAllEvents
} from '../controllers/eventController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public route - get all events
/**
 * @swagger
 * /api/events/all:
 *   get:
 *     summary: Get all public events
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: List of all events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 events:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Event'
 */
router.get('/all', getAllEvents);

// Public route - get event details by ID (no authentication required)
/**
 * @swagger
 * /api/events/public/{id}:
 *   get:
 *     summary: Get public event details by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 event:
 *                   $ref: '#/components/schemas/Event'
 *       404:
 *         description: Event not found
 */
router.get('/public/:id', getPublicEventById);

// All other routes require authentication
router.use(authenticateToken);

/**
 * @swagger
 * /api/events/create:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEventRequest'
 *     responses:
 *       201:
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 event:
 *                   $ref: '#/components/schemas/Event'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/create', createEvent);

/**
 * @swagger
 * /api/events/user:
 *   get:
 *     summary: Get all events for the authenticated user
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 events:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Event'
 */
router.get('/user', getUserEvents);

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Get event details by ID
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 event:
 *                   $ref: '#/components/schemas/Event'
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', getEventById);

/**
 * @swagger
 * /api/events/recommend-services:
 *   post:
 *     summary: Generate service recommendations for an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - event_id
 *             properties:
 *               event_id:
 *                 type: string
 *                 format: uuid
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Service recommendations generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 recommendations:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ServiceRecommendation'
 *                 notification:
 *                   type: string
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/recommend-services', recommendServices);

/**
 * @swagger
 * /api/events/add-to-cart:
 *   post:
 *     summary: Add a service to the event cart
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - event_id
 *               - service_type_id
 *             properties:
 *               event_id:
 *                 type: string
 *                 format: uuid
 *               service_type_id:
 *                 type: string
 *                 format: uuid
 *               quantity:
 *                 type: integer
 *                 default: 1
 *     responses:
 *       200:
 *         description: Item added to cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 cart_item:
 *                   type: object
 */
router.post('/add-to-cart', addToCart);

/**
 * @swagger
 * /api/events/add-all-to-cart:
 *   post:
 *     summary: Add all recommended services to cart
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - event_id
 *             properties:
 *               event_id:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: All recommendations added to cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 cart_items:
 *                   type: array
 *                 count:
 *                   type: integer
 */
router.post('/add-all-to-cart', addAllToCart);

/**
 * @swagger
 * /api/events/remove-from-cart:
 *   post:
 *     summary: Remove a service from the event cart
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - event_id
 *               - service_type_id
 *             properties:
 *               event_id:
 *                 type: string
 *                 format: uuid
 *               service_type_id:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Item removed from cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post('/remove-from-cart', removeFromCart);

/**
 * @swagger
 * /api/events/checkout-preview:
 *   post:
 *     summary: Get checkout preview with vendor matches
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - event_id
 *             properties:
 *               event_id:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Checkout preview with vendor matches
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 event_id:
 *                   type: string
 *                 event_title:
 *                   type: string
 *                 matches:
 *                   type: array
 *                 validation:
 *                   type: object
 *                 total_cost:
 *                   type: number
 *       400:
 *         description: Bad request or cart is empty
 */
router.post('/checkout-preview', getCheckoutPreview);

/**
 * @swagger
 * /api/events/checkout:
 *   post:
 *     summary: Complete checkout and match services to vendors
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - event_id
 *             properties:
 *               event_id:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Checkout completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 event_id:
 *                   type: string
 *                   format: uuid
 *                 booked_services:
 *                   type: array
 *                 total_cost:
 *                   type: number
 *                   format: float
 *                 services_count:
 *                   type: integer
 *       400:
 *         description: Bad request or services could not be matched
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/checkout', checkout);

export default router;
