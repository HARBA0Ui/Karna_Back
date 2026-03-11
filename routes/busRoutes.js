import { Router } from 'express';
import * as busController from '../controllers/busController.js';
import isAuthorized from '../middleware/isAuthorized.js';
import { createBusValidator, busIdValidator } from '../middleware/validators/busValidator.js';
import { handleValidationErrors } from '../middleware/validators/validationHandler.js';

const router = Router();

router.get('/', busController.getAllBuses);
router.get('/:id', busIdValidator, handleValidationErrors, busController.getBusById);
router.post('/', isAuthorized, createBusValidator, handleValidationErrors, busController.createBus);
router.delete('/:id', isAuthorized, busIdValidator, handleValidationErrors, busController.deleteBus);

/**
 * @swagger
 * /api/buses:
 *   get:
 *     summary: Get all buses
 *     tags: [Buses]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of all buses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   number:
 *                     type: string
 *       401:
 *         description: User not authenticated
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/buses/{id}:
 *   get:
 *     summary: Get bus by ID
 *     tags: [Buses]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bus ID (MongoDB ObjectId)
 *     responses:
 *       200:
 *         description: Bus details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 number:
 *                   type: string
 *       400:
 *         description: Invalid bus ID format
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: Bus not found
 */

/**
 * @swagger
 * /api/buses:
 *   post:
 *     summary: Create a new bus (Admin only)
 *     tags: [Buses]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - number
 *             properties:
 *               number:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 10
 *                 example: BUS001
 *     responses:
 *       201:
 *         description: Bus created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 number:
 *                   type: string
 *       400:
 *         description: Validation error or bus number already exists
 *       401:
 *         description: User not authenticated
 *       403:
 *         description: Admin access required
 */


/**
 * @swagger
 * /api/buses/{id}:
 *   delete:
 *     summary: Delete a bus (Admin only)
 *     tags: [Buses]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bus ID (MongoDB ObjectId)
 *     responses:
 *       200:
 *         description: Bus deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Invalid bus ID format
 *       401:
 *         description: User not authenticated
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Bus not found
 */
export default router;
