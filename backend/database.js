const mongoose = require('mongoose');

let isConnected = false; // Global caching for Serverless environments

async function initDb() {
  if (isConnected) {
    console.log('[MongoDB] Reusing existing database connection.');
    return mongoose.connection;
  }

  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nexora';
  
  try {
    const db = await mongoose.connect(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });
    
    isConnected = db.connections[0].readyState === 1;
    console.log(`[MongoDB] Successfully established new connection.`);
    
    if (!process.env.VERCEL) {
      // Graceful shutdown handling for local development only
      process.on('SIGINT', async () => {
        await mongoose.connection.close();
        console.log('[MongoDB] Connection closed due to app termination');
        process.exit(0);
      });
    }

  } catch (error) {
    console.error('[MongoDB] Connection error:', error.message);
    if (!process.env.VERCEL) process.exit(1);
    throw error;
  }

  return mongoose.connection;
}

async function getDb() {
  return initDb();
}

module.exports = { getDb, initDb };
