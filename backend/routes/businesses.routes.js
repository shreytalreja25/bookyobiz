const { Router } = require('express');
const { getDb } = require('../db.js');
const { requireAuth } = require('../middleware/auth.js');

const router = Router();

function col() {
  return getDb().collection('businesses');
}

async function ensureIndexes() {
  try {
    await col().createIndex({ coords: '2dsphere' });
  } catch (_) {}
  try {
    await col().createIndex({ name: 'text', vertical: 1 });
  } catch (_) {}
}
ensureIndexes();

router.get('/', requireAuth, async (req, res) => {
  try {
    const {
      lat,
      lng,
      radiusKm = '10',
      vertical,
      q,
      limit = '50',
    } = req.query;

    const baseQuery = {};
    if (vertical) baseQuery.vertical = String(vertical).toLowerCase();
    if (q) baseQuery.$text = { $search: String(q) };

    const lim = Math.max(1, Math.min(200, Number(limit) || 50));

    // If coords provided, use geoNear aggregation, else simple find
    if (lat && lng) {
      const pipeline = [
        {
          $geoNear: {
            near: { type: 'Point', coordinates: [Number(lng), Number(lat)] },
            distanceField: 'distanceMeters',
            maxDistance: (Number(radiusKm) || 10) * 1000,
            query: baseQuery,
            spherical: true,
          },
        },
        { $limit: lim },
        {
          $project: {
            name: 1,
            vertical: 1,
            rating: 1,
            address: 1,
            photoUrl: 1,
            coverUrl: 1,
            coords: 1,
            distanceMeters: 1,
          },
        },
      ];
      const docs = await col().aggregate(pipeline).toArray();
      const items = docs.map((d) => ({ ...d, distanceKm: d.distanceMeters ? d.distanceMeters / 1000 : undefined }));
      return res.json(items);
    }

    const cursor = col()
      .find(baseQuery)
      .limit(lim)
      .project({ name: 1, vertical: 1, rating: 1, address: 1, photoUrl: 1, coverUrl: 1, coords: 1 });
    const items = await cursor.toArray();
    return res.json(items);
  } catch (err) {
    return res.status(500).json({ error: 'server error' });
  }
});

router.get('/:id', requireAuth, async (req, res) => {
  try {
    const { ObjectId } = require('mongodb');
    const id = new ObjectId(String(req.params.id));
    const doc = await col().findOne({ _id: id });
    if (!doc) return res.status(404).json({ error: 'not found' });
    return res.json(doc);
  } catch (err) {
    return res.status(400).json({ error: 'invalid id' });
  }
});

module.exports = router;


