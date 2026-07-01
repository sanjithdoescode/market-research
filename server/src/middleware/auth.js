import { getAuth } from '@clerk/express';

export function preventCache(req, res, next) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  next();
}

export function requireAuth(req, res, next) {
  try {
    const auth = getAuth(req);
    if (!auth || typeof auth.userId !== 'string' || auth.userId.trim() === '') {
      return res.status(401).json({ error: 'Authentication required' });
    }
    req.auth = auth;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Authentication required' });
  }
}
