import { Router } from 'express';
import { debugDemand } from '../controllers/debugDemandController.js';

/**
 * Debug routes — for auditing and diagnosing the Demand Signal Engine.
 *
 * These routes make real external API calls (Google Places, Mistral)
 * and are intended for development and QA use only.
 *
 * In production, access should be restricted via environment-gated
 * middleware or an internal-only network rule.
 */
const router = Router();

// POST /api/debug/demand
// Full demand pipeline diagnostic with raw counts, dedup stats, and score breakdown
router.post('/demand', debugDemand);

export default router;
