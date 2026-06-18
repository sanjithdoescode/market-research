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
    const history = await findHistory({ limit });
    return sendSuccess(res, history.map(formatHistoryItem));
  } catch (error) {
    return next(error);
  }
}

export async function getHistoryById(req, res, next) {
  try {
    assertObjectId(req.params.id);
    const analysis = await findHistoryById(req.params.id);

    if (!analysis) {
      throw new AppError(404, 'Analysis history entry not found.');
    }

    return sendSuccess(res, formatAnalysisDocument(analysis));
  } catch (error) {
    return next(error);
  }
}

export async function deleteHistory(req, res, next) {
  try {
    assertObjectId(req.params.id);
    const deleted = await deleteHistoryById(req.params.id);

    if (!deleted) {
      throw new AppError(404, 'Analysis history entry not found.');
    }

    return sendSuccess(res, { id: req.params.id, deleted: true });
  } catch (error) {
    return next(error);
  }
}
