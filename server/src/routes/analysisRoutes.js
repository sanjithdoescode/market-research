import { Router } from 'express';

import { createAnalysis, chatWithAnalysis, chatGeneral } from '../controllers/analysisController.js';
import { analysisLimiter, chatLimiter } from '../middleware/rateLimiter.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { analysisRequestSchema, chatRequestSchema } from '../validators/analysisValidator.js';

const router = Router();

router.post('/', analysisLimiter, validateRequest(analysisRequestSchema), createAnalysis);
router.post('/chat', chatLimiter, validateRequest(chatRequestSchema), chatGeneral);
router.post('/:id/chat', chatLimiter, validateRequest(chatRequestSchema), chatWithAnalysis);

export default router;

