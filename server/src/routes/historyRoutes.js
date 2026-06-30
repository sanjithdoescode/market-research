import { Router } from 'express';

import { deleteHistory, getHistory, getHistoryById } from '../controllers/historyController.js';

import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', getHistory);
router.get('/:id', getHistoryById);
router.delete('/:id', deleteHistory);

export default router;
