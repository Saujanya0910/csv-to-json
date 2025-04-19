const dotenv = require('dotenv');

function getDatabaseConfig() {
  dotenv.config();
  
  return {
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE
  };
}

/**
 * Initializes the database connection and sets it to a global variable.
 * @param {import('../services/database')} DatabaseService - The DatabaseService class
 * @returns {Promise<import('pg').Pool>} The database connection pool.
 */
function initializeDatabase(DatabaseService) {
  const config = getDatabaseConfig();
  const db = DatabaseService.getInstance(config);
  global.db = db;
  return db;
}

module.exports = {
  getDatabaseConfig,
  initializeDatabase
};