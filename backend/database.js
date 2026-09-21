const mongoose = require('mongoose');

async function getDb() {
  // Return the active connection for any direct references if needed
  return mongoose.connection;
}

async function initDb() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nexora';
  
  try {
    await mongoose.connect(uri);
    console.log(`[MongoDB] Successfully connected to ${uri}`);
    
    // Graceful shutdown handling
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('[MongoDB] Connection closed due to app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('[MongoDB] Connection error:', error.message);
    process.exit(1);
  }

  return mongoose.connection;
}

module.exports = { getDb, initDb };
