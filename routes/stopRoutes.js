import { Router } from 'express';
import { listStops, createStop } from '../controllers/stopController.js';
import isAuthorized from '../middleware/isAuthorized.js';

const router = Router();

router.get('/', listStops);
router.post('/', isAuthorized, createStop);

export default router;
