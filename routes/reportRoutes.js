import express from 'express';
import {
  listReports,
  getReportDetail,
  createReport,
  validateReport,
  rejectReport
} from '../controllers/reportController.js';
import isAuthorized from '../middleware/isAuthorized.js';
import isAdmin from '../middleware/isAdmin.js';
import { createReportValidator } from '../middleware/validators/reportValidator.js';
import { handleValidationErrors } from '../middleware/validators/validationHandler.js';

const router = express.Router();

router.get('/', isAuthorized, isAdmin, listReports);
router.get('/:id', isAuthorized, isAdmin, getReportDetail);
router.post('/', isAuthorized, createReportValidator, handleValidationErrors, createReport);
router.patch('/:id/validate', isAuthorized, isAdmin, validateReport);
router.patch('/:id/reject', isAuthorized, isAdmin, rejectReport);

/**
 * @swagger
 * /api/reports:
 *   get:
 *     summary: List all reports (Admin only)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of all reports
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       403:
 *         description: Admin access required
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/reports/{id}:
 *   get:
 *     summary: Get report details (Admin only)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Report details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Report not found
 */

/**
 * @swagger
 * /api/reports:
 *   post:
 *     summary: Create a report
 *     tags: [Reports]
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
 *               - reportedPost
 *               - reason
 *               - reportType
 *             properties:
 *               reportedPost:
 *                 type: string
 *                 example: 64abc123def456ghi789jkl0
 *               reason:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 200
 *                 example: Inappropriate content
 *               message:
 *                 type: string
 *                 maxLength: 500
 *                 example: This post violates community guidelines
 *               reportType:
 *                 type: string
 *                 enum: [post, location]
 *                 example: post
 *     responses:
 *       201:
 *         description: Report created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Validation error
 *       401:
 *         description: User not authenticated
 */

/**
 * @swagger
 * /api/reports/{id}/validate:
 *   patch:
 *     summary: Validate a report (Admin only)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Report validated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Report not found
 */

/**
 * @swagger
 * /api/reports/{id}/reject:
 *   patch:
 *     summary: Reject a report (Admin only)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Report rejected
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Report not found
 */

export default router;