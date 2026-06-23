import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import { env } from './config/env.js';
import analysisRoutes from './routes/analysisRoutes.js';
import debugRoutes from './routes/debugRoutes.js';
import historyRoutes from './routes/historyRoutes.js';
import configRoutes from './routes/configRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/logger.js';
import { apiLimiter } from './middleware/rateLimiter.js';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.clientOrigin,
    credentials: true
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(requestLogger);
app.use('/api', apiLimiter);

app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      service: 'marketsense-api',
      status: 'ok',
      timestamp: new Date().toISOString()
    }
  });
});

app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'MarketSense API is running.'
  });
});

app.use('/api/analysis', analysisRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/debug', debugRoutes);
app.use('/api/config', configRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
