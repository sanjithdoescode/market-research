import Analysis from '../models/Analysis.js';
import Competitor from '../models/Competitor.js';
import Search from '../models/Search.js';

export async function findHistory({ clerkId, limit = 25 } = {}) {
  if (!clerkId || typeof clerkId !== 'string' || clerkId.trim() === '') {
    return [];
  }
  return Analysis.find({ clerkId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('search')
    .select('-rawAiResponse')
    .exec();
}

export async function findHistoryById(id) {
  return Analysis.findById(id).populate('search').populate('competitors').exec();
}

export async function deleteHistoryById(id) {
  const analysis = await Analysis.findById(id).exec();

  if (!analysis) {
    return null;
  }

  await Competitor.deleteMany({ _id: { $in: analysis.competitors } }).exec();
  await Search.deleteOne({ _id: analysis.search }).exec();
  await Analysis.deleteOne({ _id: analysis._id }).exec();

  return analysis;
}
