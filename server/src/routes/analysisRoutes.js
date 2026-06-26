import { Router } from 'express';

import { createAnalysis, chatWithAnalysis, chatGeneral, getNicheSuggestions, getAnalysisStatus } from '../controllers/analysisController.js';
import { analysisLimiter, chatLimiter } from '../middleware/rateLimiter.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { analysisRequestSchema, chatRequestSchema, nicheSuggestionsRequestSchema } from '../validators/analysisValidator.js';

const router = Router();

router.post('/', analysisLimiter, validateRequest(analysisRequestSchema), createAnalysis);
router.get('/status/:id', getAnalysisStatus);
router.post('/niche-suggestions', validateRequest(nicheSuggestionsRequestSchema), getNicheSuggestions);
router.post('/chat', chatLimiter, validateRequest(chatRequestSchema), chatGeneral);
router.post('/:id/chat', chatLimiter, validateRequest(chatRequestSchema), chatWithAnalysis);

export default router;

