require('dotenv').config();
const { connectMongo, getDb, closeMongo } = require('./db');

async function main() {
  await connectMongo(process.env.MONGO_URI);
  const db = getDb();
  const businesses = db.collection('businesses');

  await businesses.createIndex({ coords: '2dsphere' });
  await businesses.createIndex({ name: 'text', vertical: 1 });

  const seed = [
    {
      name: 'Sharp Fade Barbers',
      vertical: 'barber',
      rating: 4.6,
      address: '123 King St',
      coords: { type: 'Point', coordinates: [151.2093, -33.8688] },
      photoUrl: '',
      coverUrl: '',
      createdAt: new Date(),
    },
    {
      name: 'Glow Salon',
      vertical: 'salon',
      rating: 4.8,
      address: '45 Queen Rd',
      coords: { type: 'Point', coordinates: [144.9631, -37.8136] },
      photoUrl: '',
      coverUrl: '',
      createdAt: new Date(),
    },
    {
      name: 'Zen Spa',
      vertical: 'spa',
      rating: 4.7,
      address: '200 Harbour St',
      coords: { type: 'Point', coordinates: [153.0260, -27.4705] },
      photoUrl: '',
      coverUrl: '',
      createdAt: new Date(),
    },
  ];

  await businesses.deleteMany({ name: { $in: seed.map((s) => s.name) } });
  await businesses.insertMany(seed);
  console.log(`[seed] Inserted ${seed.length} businesses`);
  await closeMongo();
}

main().catch((e) => { console.error(e); process.exit(1); });


