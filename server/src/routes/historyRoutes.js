import { Router } from 'express';

import { deleteHistory, getHistory, getHistoryById } from '../controllers/historyController.js';

const router = Router();

router.get('/', getHistory);
router.get('/:id', getHistoryById);
router.delete('/:id', deleteHistory);

export default router;
