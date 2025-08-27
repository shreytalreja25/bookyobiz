const { Router } = require('express');
const { getDb } = require('../db.js');
const { requireAuth } = require('../middleware/auth.js');
const { toObjectId } = require('../util.js');

function makeCrudRouter(collectionName) {
  const router = Router();
  const col = () => getDb().collection(collectionName);

  router.get('/', requireAuth, async (req, res) => {
    const items = await col().find({}).limit(100).toArray();
    res.json(items);
  });

  router.post('/', requireAuth, async (req, res) => {
    const doc = { ...req.body, createdAt: new Date(), updatedAt: new Date() };
    const r = await col().insertOne(doc);
    res.status(201).json({ id: r.insertedId });
  });

  router.get('/:id', requireAuth, async (req, res) => {
    const id = toObjectId(req.params.id);
    if (!id) return res.status(400).json({ error: 'invalid id' });
    const doc = await col().findOne({ _id: id });
    if (!doc) return res.status(404).json({ error: 'not found' });
    res.json(doc);
  });

  router.put('/:id', requireAuth, async (req, res) => {
    const id = toObjectId(req.params.id);
    if (!id) return res.status(400).json({ error: 'invalid id' });
    const update = { ...req.body, updatedAt: new Date() };
    await col().updateOne({ _id: id }, { $set: update });
    res.json({ ok: true });
  });

  router.delete('/:id', requireAuth, async (req, res) => {
    const id = toObjectId(req.params.id);
    if (!id) return res.status(400).json({ error: 'invalid id' });
    await col().deleteOne({ _id: id });
    res.json({ ok: true });
  });

  return router;
}

module.exports = { makeCrudRouter };


