const { Router } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDb } = require('../db.js');
const { requireAuth } = require('../middleware/auth.js');

const router = Router();

function users() {
  return getDb().collection('users');
}

async function ensureIndexes() {
  try {
    await users().createIndex({ email: 1 }, { unique: true });
  } catch (_) {}
}
ensureIndexes();

router.post('/register', async (req, res) => {
  try {
    let { email, password, role = 'customer' } = req.body || {};
    // Restrict elevated roles creation
    const allowedRoles = ['customer', 'staff', 'owner'];
    if (!allowedRoles.includes(role)) role = 'customer';
    // Only allow owner creation for specific email
    const OWNER_EMAIL = (process.env.OWNER_EMAIL || '').toLowerCase();
    if (role === 'owner' && email.toLowerCase() !== OWNER_EMAIL) {
      role = 'customer';
    }
    if (!email || !password) return res.status(400).json({ error: 'email and password are required' });
    const hash = await bcrypt.hash(password, 10);
    const doc = { email: String(email).toLowerCase(), passwordHash: hash, role, createdAt: new Date() };
    const result = await users().insertOne(doc);
    return res.status(201).json({ id: result.insertedId, email: doc.email, role: doc.role });
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(409).json({ error: 'email already registered' });
    }
    return res.status(500).json({ error: 'server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'email and password are required' });
    const user = await users().findOne({ email: String(email).toLowerCase() });
    if (!user) return res.status(401).json({ error: 'invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'invalid credentials' });
    const token = jwt.sign({ userId: String(user._id), role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token });
  } catch (_) {
    return res.status(500).json({ error: 'server error' });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await users().findOne({ _id: new (require('mongodb').ObjectId)(req.user.userId) }, { projection: { passwordHash: 0 } });
    if (!user) return res.status(404).json({ error: 'not found' });
    return res.json(user);
  } catch (_) {
    return res.status(500).json({ error: 'server error' });
  }
});

module.exports = router;


