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

const router = express.Router();
router.get('/', isAuthorized, isAdmin, listReports);
router.get('/:id', isAuthorized, isAdmin, getReportDetail);
router.post('/', isAuthorized, createReport);
router.patch('/:id/validate', isAuthorized, isAdmin, validateReport);
router.patch('/:id/reject', isAuthorized, isAdmin, rejectReport);
/**
 * @swagger
 * /api/reports:
 *   get:
 *     summary: List all reports (Admin only)
 *     tags: [Reports]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of reports
 */
/**
 * @swagger
 * /api/reports/{id}:
 *   get:
 *     summary: Get report details (Admin only)
 *     tags: [Reports]
 *     security:
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
 */
/**
 * @swagger
 * /api/reports:
 *   post:
 *     summary: Create a report
 *     tags: [Reports]
 *     security:
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
 *               reason:
 *                 type: string
 *               message:
 *                 type: string
 *               reportType:
 *                 type: string
 *                 enum: [post, location]
 *     responses:
 *       201:
 *         description: Report created
 */
/**
 * @swagger
 * /api/reports/{id}/validate:
 *   patch:
 *     summary: Validate a report (Admin only)
 *     tags: [Reports]
 *     security:
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
 */
/**
 * @swagger
 * /api/reports/{id}/reject:
 *   patch:
 *     summary: Reject a report (Admin only)
 *     tags: [Reports]
 *     security:
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
 */

export default router;
