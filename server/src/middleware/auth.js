import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

const projectId = env.firebaseProjectId;

if (projectId) {
  if (getApps().length === 0) {
    initializeApp({
      projectId: projectId
    });
  }
} else {
  console.warn('Warning: FIREBASE_PROJECT_ID is not configured in the server.');
}

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(401, 'Unauthenticated. No token provided.');
    }

    const token = authHeader.split('Bearer ')[1];
    if (!token) {
      throw new AppError(401, 'Unauthenticated. Empty token.');
    }

    if (!projectId) {
      throw new AppError(500, 'Firebase authentication is not configured on the server.');
    }

    const decodedToken = await getAuth().verifyIdToken(token);
    req.auth = {
      userId: decodedToken.uid,
      email: decodedToken.email
    };
    next();
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    return next(new AppError(401, `Unauthenticated. Invalid token: ${error.message}`));
  }
}
