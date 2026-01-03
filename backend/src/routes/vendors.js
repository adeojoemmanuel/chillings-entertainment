import express from 'express';
import { registerVendor, getVendors, getVendorById, getTopOrganizers } from '../controllers/vendorController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /api/vendors/register:
 *   post:
 *     summary: Register as a vendor
 *     tags: [Vendors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VendorRegisterRequest'
 *     responses:
 *       201:
 *         description: Vendor registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 vendor:
 *                   $ref: '#/components/schemas/Vendor'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/register', authenticateToken, registerVendor);

/**
 * @swagger
 * /api/vendors:
 *   get:
 *     summary: List vendors (public endpoint)
 *     tags: [Vendors]
 *     parameters:
 *       - in: query
 *         name: service_type_id
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by service type
 *       - in: query
 *         name: city_id
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by city
 *       - in: query
 *         name: min_rating
 *         schema:
 *           type: number
 *           format: float
 *         description: Minimum rating
 *     responses:
 *       200:
 *         description: List of vendors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 vendors:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Vendor'
 */
router.get('/', getVendors);

/**
 * @swagger
 * /api/vendors/organizers:
 *   get:
 *     summary: Get top organizers
 *     tags: [Vendors]
 *     responses:
 *       200:
 *         description: List of top organizers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 organizers:
 *                   type: array
 */
router.get('/organizers', getTopOrganizers);

/**
 * @swagger
 * /api/vendors/{id}:
 *   get:
 *     summary: Get vendor details by ID
 *     tags: [Vendors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Vendor ID
 *     responses:
 *       200:
 *         description: Vendor details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 vendor:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     business_name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     rating:
 *                       type: number
 *                     is_verified:
 *                       type: boolean
 *                     events_hosted_count:
 *                       type: integer
 *                     vendor_services:
 *                       type: array
 *       404:
 *         description: Vendor not found
 */
router.get('/:id', getVendorById);

export default router;
