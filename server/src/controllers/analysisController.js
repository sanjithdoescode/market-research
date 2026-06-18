import { createMarketAnalysis } from '../services/analysisService.js';
import { findAnalysisById } from '../repositories/analysisRepository.js';
import { generateChatResponse, generateNicheSuggestions } from '../services/mistralService.js';
import { AppError } from '../utils/AppError.js';
import { sendSuccess } from '../utils/responseFormatter.js';

export async function createAnalysis(req, res, next) {
  try {
    const analysis = await createMarketAnalysis(req.validatedBody);
    return sendSuccess(res, analysis, 201);
  } catch (error) {
    return next(error);
  }
}

export async function chatWithAnalysis(req, res, next) {
  try {
    const { id } = req.params;
    const { messages } = req.validatedBody;

    const analysis = await findAnalysisById(id);
    if (!analysis) {
      throw new AppError(404, 'Analysis record not found.');
    }

    const chatResponse = await generateChatResponse({ analysis, messages });
    return sendSuccess(res, chatResponse);
  } catch (error) {
    return next(error);
  }
}

export async function chatGeneral(req, res, next) {
  try {
    const { messages } = req.validatedBody;
    const chatResponse = await generateChatResponse({ analysis: null, messages });
    return sendSuccess(res, chatResponse);
  } catch (error) {
    return next(error);
  }
}

export async function getNicheSuggestions(req, res, next) {
  try {
    const { businessType, location } = req.validatedBody;
    const niches = await generateNicheSuggestions({ businessType, location });
    return sendSuccess(res, niches);
  } catch (error) {
    return next(error);
  }
}

