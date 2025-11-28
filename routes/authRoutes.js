import { Router } from 'express';
import { login, logout, register } from '../controllers/authController.js';

const router = Router();
router.post('/login', login);
router.post('/logout', logout);
router.post('/register', register);

export default router;

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register as a passenger
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nickname
 *               - email
 *               - pwd
 *             properties:
 *               nickname:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               pwd:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: Registration successful
 *       400:
 *         description: Input/validation error
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - pwd
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               pwd:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 */