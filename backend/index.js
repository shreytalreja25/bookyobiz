require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
let MongoClient;
try {
  ({ MongoClient } = require('mongodb'));
} catch (_) {
  // mongodb package not installed yet; DB will be skipped
}

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

// MongoDB connection (optional)
let mongoClient = null;
let mongoDb = null;
async function connectMongo() {
  if (!MongoClient || !process.env.MONGO_URI) {
    console.log('[mongo] Skipping connection (driver missing or MONGO_URI not set)');
    return;
  }
  try {
    mongoClient = new MongoClient(process.env.MONGO_URI, { maxPoolSize: 10 });
    await mongoClient.connect();
    const url = new URL(process.env.MONGO_URI);
    const dbName = (url.pathname && url.pathname.slice(1)) || 'bookyobiz';
    mongoDb = mongoClient.db(dbName);
    console.log(`[mongo] Connected to database: ${dbName}`);
  } catch (err) {
    console.error('[mongo] Connection error:', err.message);
  }
}
connectMongo();

// Health endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    db: mongoDb ? 'ok' : (process.env.MONGO_URI ? 'down' : 'skipped'),
    uptimeSec: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// Root
app.get('/', (req, res) => {
  res.type('text').send('Server is running\n');
});

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


