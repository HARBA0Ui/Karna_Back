import express from 'express';
import {
  listPosts,
  getPostDetail,
  createPost,
  updateStatus,
  deletePost,
  upvote,
  downvote
} from '../controllers/postController.js';
import isAuthorized from '../middleware/isAuthorized.js';
import isAdmin from '../middleware/isAdmin.js';
import isPassenger from '../middleware/isPassenger.js';
import { createPostValidator, updateStatusValidator } from '../middleware/validators/postValidator.js';
import { handleValidationErrors } from '../middleware/validators/validationHandler.js';

const router = express.Router();

router.get('/', listPosts);
router.get('/:id', getPostDetail);
router.post('/', isAuthorized, isPassenger, createPostValidator, handleValidationErrors, createPost);
router.post('/live-location', isAuthorized, isPassenger, createPostValidator, handleValidationErrors, createPost);
router.patch('/:id/status', isAuthorized, isAdmin, updateStatusValidator, handleValidationErrors, updateStatus);
router.delete('/:id', isAuthorized, isAdmin, deletePost);
router.post('/:id/upvote', isAuthorized, isPassenger, upvote);
router.post('/:id/downvote', isAuthorized, isPassenger, downvote);

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: List all posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: List of all posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 message:
 *                   type: string
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: Get post details
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID (MongoDB ObjectId)
 *     responses:
 *       200:
 *         description: Post details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Post not found
 */

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new post (CommunityPost or LiveLocation)
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - type: object
 *                 title: CommunityPost
 *                 required:
 *                   - type
 *                   - bus
 *                   - title
 *                 properties:
 *                   type:
 *                     type: string
 *                     enum: [CommunityPost]
 *                   bus:
 *                     type: string
 *                     example: 64abc123def456ghi789jkl0
 *                   title:
 *                     type: string
 *                     example: New route update
 *                   description:
 *                     type: string
 *                     example: Bus route changed due to road works
 *                   stops:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         stopId:
 *                           type: string
 *                         time:
 *                           type: string
 *                           pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$'
 *               - type: object
 *                 title: LiveLocation
 *                 required:
 *                   - type
 *                   - bus
 *                   - lat
 *                   - long
 *                 properties:
 *                   type:
 *                     type: string
 *                     enum: [liveLocation]
 *                   bus:
 *                     type: string
 *                     example: 64abc123def456ghi789jkl0
 *                   lat:
 *                     type: number
 *                     example: 6.5244
 *                   long:
 *                     type: number
 *                     example: 3.3792
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/posts/live-location:
 *   post:
 *     summary: Create a live location post
 *     tags: [Posts]
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
 *               - type
 *               - bus
 *               - lat
 *               - long
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [liveLocation]
 *               bus:
 *                 type: string
 *               lat:
 *                 type: number
 *               long:
 *                 type: number
 *     responses:
 *       201:
 *         description: Live location post created
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /api/posts/{id}/status:
 *   patch:
 *     summary: Update post status (Admin only)
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [validé, rejeté]
 *     responses:
 *       200:
 *         description: Status updated
 *       403:
 *         description: Admin access required
 */

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Delete post (Admin only)
 *     tags: [Posts]
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
 *         description: Post deleted successfully
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Post not found
 */

/**
 * @swagger
 * /api/posts/{id}/upvote:
 *   post:
 *     summary: Upvote a post
 *     tags: [Posts]
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
 *         description: Post upvoted successfully
 *       400:
 *         description: Already upvoted or already downvoted
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: Post not found
 */

/**
 * @swagger
 * /api/posts/{id}/downvote:
 *   post:
 *     summary: Downvote a post
 *     tags: [Posts]
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
 *         description: Post downvoted successfully
 *       400:
 *         description: Already downvoted or already upvoted
 *       401:
 *         description: User not authenticated
 *       404:
 *         description: Post not found
 */

export default router;