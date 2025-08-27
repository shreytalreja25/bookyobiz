require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { connectMongo, getDb, ready: mongoReady, closeMongo } = require('./db.js');
const { validateOnStartup } = require('./env.validate.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(morgan(process.env.LOG_LEVEL === 'debug' ? 'dev' : 'tiny'));
app.use(express.json());

// CORS setup from env (comma-separated origins)
const rawOrigins = process.env.CORS_ALLOWED_ORIGINS || '';
const allowedOrigins = rawOrigins
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow same-origin/non-browser
      const isAllowed = allowedOrigins.includes(origin);
      callback(isAllowed ? null : new Error('Not allowed by CORS'), isAllowed);
    },
    credentials: true,
  })
);

// Startup summary (safe)
console.log('[startup] ENV summary:', {
  nodeEnv: process.env.NODE_ENV,
  port: String(PORT),
  logLevel: process.env.LOG_LEVEL,
  corsAllowedOrigins: allowedOrigins,
  mongoConfigured: Boolean(process.env.MONGO_URI),
});

// Validate environment (will throw for critical missing keys)
try {
  validateOnStartup();
} catch (err) {
  console.error('[startup] Env validation failed:', err.message);
  process.exit(1);
}

// MongoDB connection
(async () => {
  try {
    await connectMongo(process.env.MONGO_URI);
  } catch (err) {
    console.error('[mongo] Connection error:', err.message);
  }
})();

// Health endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    db: mongoReady() ? 'ok' : (process.env.MONGO_URI ? 'down' : 'skipped'),
    uptimeSec: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// Root
app.get('/', (req, res) => {
  res.type('text').send('Server is running\n');
});

// Routes
app.use('/auth', require('./routes/auth.routes.js'));
const { makeCrudRouter } = require('./routes/crud.routes.js');
app.use('/tenants', makeCrudRouter('tenants'));
app.use('/services', makeCrudRouter('services'));
app.use('/staff', makeCrudRouter('staff'));
app.use('/appointments', makeCrudRouter('appointments'));
app.use('/availability', require('./routes/availability.routes.js'));
app.use('/businesses', require('./routes/businesses.routes.js'));

const HOST = '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`[startup] Listening on ${HOST}:${PORT}`);
  if (process.env.RENDER_EXTERNAL_URL) {
    console.log(`[startup] External URL: ${process.env.RENDER_EXTERNAL_URL}`);
  }
});

// Global error handlers
process.on('unhandledRejection', (reason) => {
  console.error('[process] Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('[process] Uncaught Exception:', err);
});
process.on('SIGTERM', async () => {
  console.log('[process] SIGTERM received, shutting down...');
  await closeMongo().catch(() => {});
  process.exit(0);
});
process.on('SIGINT', async () => {
  console.log('[process] SIGINT received, shutting down...');
  await closeMongo().catch(() => {});
  process.exit(0);
});


