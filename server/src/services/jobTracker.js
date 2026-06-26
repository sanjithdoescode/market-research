import mongoose from 'mongoose';

const activeJobs = new Map();

// Automatically clean up jobs older than 10 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [jobId, job] of activeJobs.entries()) {
    if (job.createdAt && now - job.createdAt > 10 * 60 * 1000) {
      activeJobs.delete(jobId);
    }
  }
}, 60 * 1000);

export function createJob() {
  const jobId = new mongoose.Types.ObjectId().toString();
  const job = {
    id: jobId,
    progress: 0,
    status: 'Initializing AI market models...',
    result: null,
    error: null,
    createdAt: Date.now()
  };
  activeJobs.set(jobId, job);
  return job;
}

export function updateJob(jobId, updates) {
  const job = activeJobs.get(jobId);
  if (job) {
    Object.assign(job, updates);
    activeJobs.set(jobId, job);
  }
}

export function getJob(jobId) {
  return activeJobs.get(jobId) || null;
}

export function deleteJob(jobId) {
  activeJobs.delete(jobId);
}
