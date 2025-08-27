function requireEnv(name, example) {
  const value = process.env[name];
  if (!value) {
    const hint = example ? ` e.g. ${example}` : '';
    throw new Error(`Missing required env: ${name}${hint}`);
  }
}

function validateOnStartup() {
  // Always required for prod
  requireEnv('CORS_ALLOWED_ORIGINS', 'https://your-frontend.vercel.app');
  // Optional in early dev: MONGO_URI, JWT_SECRET; throw if NODE_ENV=production
  if ((process.env.NODE_ENV || '').toLowerCase() === 'production') {
    requireEnv('MONGO_URI', 'mongodb+srv://.../bookyobiz');
    requireEnv('JWT_SECRET', 'a-strong-random-string');
  }
}

module.exports = { validateOnStartup };


