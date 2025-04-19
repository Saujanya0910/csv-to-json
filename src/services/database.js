const { Pool } = require('pg');

/**
 * Service for handling database operations
 * @class
 */
class DatabaseService {

  /**
   * Singleton instance of DatabaseService
   * @type {DatabaseService}
   */
  static instance;

  constructor(config) {
    if (DatabaseService.instance) {
      return DatabaseService.instance;
    }
    
    this.pool = new Pool({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database
    });
    
    DatabaseService.instance = this;
  }

  /**
   * Inserts a user into the database.
   * @param {string} name - The name of the user.
   * @param {number} age - The age of the user.
   * @param {object} address - The address of the user.
   * @param {object} additionalInfo - Additional information about the user.
   * @returns {Promise<import('pg').QueryResult>} The result of the insertion.
   */
  async insertUser(name, age, address, additionalInfo) {
    try {
      return await this.pool.query(
        'INSERT INTO users (name, age, address, additional_info) VALUES ($1, $2, $3, $4)',
        [name, age, JSON.stringify(address), JSON.stringify(additionalInfo)]
      );
    } catch (error) {
      throw new Error(`Database insertion failed: ${error.message}`);
    }
  }

  /**
   * Close the database connection pool.
   * @returns {Promise<void>}
   */
  async close() {
    await this.pool.end();
  }

  /**
   * Get the singleton instance of the DatabaseService.
   * @param {object} config - The database configuration.
   * @returns {DatabaseService} The singleton instance of the DatabaseService.
   */
  static getInstance(config) {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService(config);
    }
    return DatabaseService.instance;
  }
}

module.exports = DatabaseService;