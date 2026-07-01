import { getAuth } from '@clerk/express';

export function requireAuth(req, res, next) {
  try {
    const auth = getAuth(req);
    if (!auth || !auth.userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    req.auth = auth;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Authentication required' });
  }
}
