const { Router } = require('express');
const { getDb } = require('../db.js');
const { requireAuth } = require('../middleware/auth.js');
const { toObjectId, generateHourlySlots, startOfDayUTC, endOfDayUTC } = require('../util.js');

const router = Router();

// GET /availability?date=YYYY-MM-DD&staffId=<id>&serviceId=<id>
router.get('/', requireAuth, async (req, res) => {
  const date = String(req.query.date || '');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return res.status(400).json({ error: 'invalid date' });

  const staffId = req.query.staffId ? toObjectId(req.query.staffId) : null;
  const serviceId = req.query.serviceId ? toObjectId(req.query.serviceId) : null;

  const db = getDb();

  // Working window: 10:00 → 17:00 (1-hour slots)
  const slots = generateHourlySlots(date, 10, 17);

  // Find existing appointments on that day
  const dayStart = startOfDayUTC(date);
  const dayEnd = endOfDayUTC(date);

  const query = { start: { $gte: dayStart }, end: { $lte: dayEnd } };
  if (staffId) query.staffId = staffId;
  if (serviceId) query.serviceId = serviceId;

  const existing = await db.collection('appointments').find(query).toArray();

  // Filter out taken slots (overlap test)
  const available = slots.filter((slot) => {
    return !existing.some((a) => !(slot.end <= a.start || slot.start >= a.end));
  });

  res.json({ date, startHour: 10, endHour: 17, slotMinutes: 60, available });
});

// POST /appointments  { date: YYYY-MM-DD, hour: 10-16, staffId, serviceId, customer }
router.post('/book', requireAuth, async (req, res) => {
  try {
    const { date, hour, staffId, serviceId, customer } = req.body || {};
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(date))) return res.status(400).json({ error: 'invalid date' });
    const h = Number(hour);
    if (!Number.isInteger(h) || h < 10 || h > 16) return res.status(400).json({ error: 'invalid hour' });
    const staff = staffId ? toObjectId(staffId) : null;
    const service = serviceId ? toObjectId(serviceId) : null;

    const start = new Date(`${date}T${String(h).padStart(2, '0')}:00:00.000Z`);
    const end = new Date(`${date}T${String(h + 1).padStart(2, '0')}:00:00.000Z`);

    const db = getDb();

    // Clash check
    const clash = await db.collection('appointments').findOne({
      start: { $lt: end },
      end: { $gt: start },
      ...(staff ? { staffId: staff } : {}),
    });
    if (clash) return res.status(409).json({ error: 'slot taken' });

    const doc = {
      start,
      end,
      staffId: staff,
      serviceId: service,
      customer: customer || null,
      status: 'booked',
      createdAt: new Date(),
    };
    const r = await db.collection('appointments').insertOne(doc);
    res.status(201).json({ id: r.insertedId });
  } catch (_) {
    res.status(500).json({ error: 'server error' });
  }
});

module.exports = router;


