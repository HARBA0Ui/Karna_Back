import express from 'express';
import * as adminController from '../controllers/adminController.js';
import { isAdminSession } from '../middleware/isAdminSession.js';

const router = express.Router();

router.get('/login', adminController.getLogin);
router.post('/login', adminController.postLogin);
router.get('/logout', adminController.logout);

// Protected routes - require admin session
router.use(isAdminSession);
router.get('/dashboard', adminController.getDashboard);
router.get('/posts', adminController.getPosts);
router.get('/posts/:id', adminController.getPostDetail);
router.post('/posts/:id/status', adminController.updatePostStatus);
router.post('/posts/:id/delete', adminController.deletePost);
router.get('/reports', adminController.getReports);
router.get('/reports/:id', adminController.getReportDetail);
router.post('/reports/:id/status', adminController.updateReportStatus);
router.get('/users', adminController.getUsers);

/**
 * @swagger
 * /admin/login:
 *   get:
 *     summary: Get admin login page
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Admin login page (HTML)
 */
/**
 * @swagger
 * /admin/login:
 *   post:
 *     summary: Admin login
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - mdp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@example.com
 *               mdp:
 *                 type: string
 *                 format: password
 *                 example: admin123
 *     responses:
 *       302:
 *         description: Redirect to dashboard on success, or back to login on failure
 */
/**
 * @swagger
 * /admin/logout:
 *   get:
 *     summary: Admin logout
 *     tags: [Admin]
 *     responses:
 *       302:
 *         description: Redirect to login page
 */
/**
 * @swagger
 * /admin/dashboard:
 *   get:
 *     summary: Get admin dashboard
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Admin dashboard page (HTML) with statistics
 *         content:
 *           text/html: {}
 */
// ==================== POSTS ====================

/**
 * @swagger
 * /admin/posts:
 *   get:
 *     summary: List all posts (with filtering)
 *     tags: [Admin Posts]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [proposé, validé, rejeté]
 *         description: Filter by post status
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [CommunityPost, liveLocation]
 *         description: Filter by post type
 *     responses:
 *       200:
 *         description: Posts page (HTML)
 */
/**
 * @swagger
 * /admin/posts/{id}:
 *   get:
 *     summary: Get post details
 *     tags: [Admin Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post detail page (HTML)
 *       404:
 *         description: Post not found
 */
/**
 * @swagger
 * /admin/posts/{id}/status:
 *   post:
 *     summary: Update post status
 *     tags: [Admin Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [validé, rejeté]
 *     responses:
 *       302:
 *         description: Redirect to posts list
 */
/**
 * @swagger
 * /admin/posts/{id}/delete:
 *   post:
 *     summary: Delete a post
 *     tags: [Admin Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirect to posts list
 */
// ==================== REPORTS ====================

/**
 * @swagger
 * /admin/reports:
 *   get:
 *     summary: List all reports (with filtering)
 *     tags: [Admin Reports]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [en attente, validé, rejeté]
 *         description: Filter by report status
 *     responses:
 *       200:
 *         description: Reports page (HTML)
 */
/**
 * @swagger
 * /admin/reports/{id}:
 *   get:
 *     summary: Get report details
 *     tags: [Admin Reports]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Report detail page (HTML)
 *       404:
 *         description: Report not found
 */

/**
 * @swagger
 * /admin/reports/{id}/status:
 *   post:
 *     summary: Update report status
 *     tags: [Admin Reports]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [validé, rejeté]
 *     responses:
 *       302:
 *         description: Redirect to reports list
 */

// ==================== USERS ====================

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: List all users
 *     tags: [Admin Users]
 *     responses:
 *       200:
 *         description: Users page (HTML)
 */

export default router;