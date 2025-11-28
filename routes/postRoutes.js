import express from 'express';
import {
  listPosts,
  getPostDetail,
  createPost,
  updatePostStatus,
  deletePost,
  upvote,
  downvote
} from '../controllers/postController.js';
import isAuthorized from '../middleware/isAuthorized.js';
import isAdmin from '../middleware/isAdmin.js';
import isPassenger from '../middleware/isPassenger.js';

const router = express.Router();


router.get('/', listPosts);
router.get('/:id', getPostDetail);
router.post('/', isAuthorized, isPassenger, createPost);
router.post('/live-location', isAuthorized, isPassenger, createPost);
router.patch('/:id/status', isAuthorized, isAdmin, updatePostStatus);
router.delete('/:id', isAuthorized, isAdmin, deletePost);
router.post('/:id/upvote', isAuthorized, isPassenger, upvote);
router.post('/:id/downvote', isAuthorized, isPassenger, downvote);

/**
 * @swagger
 * /api/posts/{id}/upvote:
 *   post:
 *     summary: Upvote a post
 *     tags: [Posts]
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
 *         description: Post upvoted
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
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post downvoted
 *       404:
 *         description: Post not found
 */

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: List all posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: List of posts
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
 *     responses:
 *       200:
 *         description: Post details
 *       404:
 *         description: Post not found
 */
/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a post (CommunityPost or LiveLocation)
 *     tags: [Posts]
 *     security:
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
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [CommunityPost, liveLocation]
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               bus:
 *                 type: string
 *               stops:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     stopId:
 *                       type: string
 *                     time:
 *                       type: string
 *               long:
 *                 type: number
 *               lat:
 *                 type: number
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Post created
 */

/**
 * @swagger
 * /api/posts/{id}/status:
 *   patch:
 *     summary: Update post status (Admin only)
 *     tags: [Posts]
 *     security:
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
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [validé, rejeté]
 *     responses:
 *       200:
 *         description: Status updated
 */
/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Delete post (Admin only)
 *     tags: [Posts]
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
 *         description: Post deleted
 */

export default router;
