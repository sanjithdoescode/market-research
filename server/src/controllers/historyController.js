import mongoose from 'mongoose';

import { deleteHistoryById, findHistory, findHistoryById } from '../repositories/historyRepository.js';
import { AppError } from '../utils/AppError.js';
import { formatAnalysisDocument, formatHistoryItem, sendSuccess } from '../utils/responseFormatter.js';

function assertObjectId(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(400, 'Invalid history id.');
  }
}

export async function getHistory(req, res, next) {
  try {
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 25, 1), 100);
    const userId = req.auth.userId;
    const history = await findHistory({ userId, limit });
    return sendSuccess(res, history.map(formatHistoryItem));
  } catch (error) {
    return next(error);
  }
}

export async function getHistoryById(req, res, next) {
  try {
    assertObjectId(req.params.id);
    const userId = req.auth.userId;
    const analysis = await findHistoryById(req.params.id);

    if (!analysis) {
      throw new AppError(404, 'Analysis history entry not found.');
    }

    if (analysis.userId && analysis.userId !== userId) {
      throw new AppError(403, 'You do not have permission to access this analysis.');
    }

    return sendSuccess(res, formatAnalysisDocument(analysis));
  } catch (error) {
    return next(error);
  }
}

export async function deleteHistory(req, res, next) {
  try {
    assertObjectId(req.params.id);
    const userId = req.auth.userId;

    const analysis = await findHistoryById(req.params.id);
    if (!analysis) {
      throw new AppError(404, 'Analysis history entry not found.');
    }

    if (analysis.userId && analysis.userId !== userId) {
      throw new AppError(403, 'You do not have permission to delete this analysis.');
    }

    await deleteHistoryById(req.params.id);
    return sendSuccess(res, { id: req.params.id, deleted: true });
  } catch (error) {
    return next(error);
  }
}
