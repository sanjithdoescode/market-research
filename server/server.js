import app from './src/app.js';
import { connectDatabase } from './src/config/database.js';
import { env } from './src/config/env.js';

let server;

async function startServer() {
  await connectDatabase();

  server = app.listen(env.port, () => {
    console.info(`MarketSite Analyst API listening on port ${env.port}`);
  });
}

function shutdown(signal) {
  console.info(`${signal} received. Closing HTTP server.`);
  if (!server) {
    process.exit(0);
  }

  server.close(() => {
    console.info('HTTP server closed.');
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
