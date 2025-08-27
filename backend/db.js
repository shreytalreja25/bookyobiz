const { MongoClient } = require('mongodb');

let client = null;
let db = null;
let isReady = false;

async function connectMongo(uri) {
  if (!uri) {
    console.log('[mongo] Skipping connection (MONGO_URI not set)');
    return { client: null, db: null };
  }
  if (client) return { client, db };
  client = new MongoClient(uri, { maxPoolSize: 10 });
  await client.connect();
  const url = new URL(uri);
  const dbName = (url.pathname && url.pathname.slice(1)) || 'bookyobiz';
  db = client.db(dbName);
  isReady = true;
  console.log(`[mongo] Connected (db=${dbName})`);
  return { client, db };
}

function getDb() {
  return db;
}

function ready() {
  return isReady;
}

async function closeMongo() {
  if (client) {
    await client.close();
    client = null;
    db = null;
    isReady = false;
    console.log('[mongo] Closed');
  }
}

module.exports = { connectMongo, getDb, ready, closeMongo };


