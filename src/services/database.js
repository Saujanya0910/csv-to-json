const { Pool } = require('pg');

/**
 * @typedef {Object} IUser
 * @property {string} name - User's full name (firstName + lastName)
 * @property {number} age - User's age
 * @property {Object|null} address - User's address as a JSON object
 * @property {Object|null} additional_info - Additional information about the user as a JSON object
 * @property {number} id - Unique identifier for the user (auto-incremented)
 */

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
      database: config.database,
      ssl: {
        rejectUnauthorized: false
      }
    });

    this.runDefaultQuery().then(() => {
      console.log("[DatabaseService] Default query executed successfully");
      DatabaseService.instance = this;
    }).catch((error) => {
      console.error("[DatabaseService] Error executing default query:", error);
    });
  }

  /**
   * Runs a default query to test the database connection.
   * @returns {Promise<import('pg').QueryResult>} The result of the query.
   */
  async runDefaultQuery() {
    try {
      const result = await this.pool.query('SELECT NOW()');
      console.log("[DatabaseService] Default query result:", result.rows);
      return result.rows;
    } catch (error) {
      console.error("[DatabaseService] Error running default query:", error);
      throw error;
    }
  }

  /**
   * Inserts a user into the database.
   * @param {string} name - The name of the user.
   * @param {number} age - The age of the user.
   * @param {object} address - The address of the user.
   * @param {object} additionalInfo - Additional information about the user.
   * @returns {Promise<import('pg').QueryResult<Partial<IUser>>>} The result of the insertion.
   */
  async insertUser(name, age, address, additionalInfo) {
    if (!(name && age && address && additionalInfo)) {
      throw new Error("Invalid input: all fields are required");
    }

    try {
      return await this.pool.query(
        'INSERT INTO public.users (name, age, address, additional_info) VALUES ($1, $2, $3, $4)',
        [name, age, JSON.stringify(address), JSON.stringify(additionalInfo)]
      );
    } catch (error) {
      throw new Error(`Database insertion failed: ${error.message}`);
    }
  }

  /**
   * Inserts multiple users into the database in one query.
   * @param {Array<{name: string, age: number, address: object, additionalInfo: object}>} users - The array of user objects to insert.
   * @returns {Promise<import('pg').QueryResult<Partial<IUser>>>} The result of the bulk insertion.
   */
  async insertUsersInBulk(users) {
    if (!Array.isArray(users) || users.length === 0) {
      throw new Error("Invalid input: users should be a non-empty array");
    }

    try {
      // Build parameterized query with multiple values
      const values = [];
      const placeholders = [];
      let paramIndex = 1;
      
      for (const user of users) {
        placeholders.push(`($${paramIndex}, $${paramIndex + 1}, $${paramIndex + 2}, $${paramIndex + 3})`);
        values.push(
          user.name,
          user.age,
          JSON.stringify(user.address),
          JSON.stringify(user.additionalInfo)
        );
        paramIndex += 4;
      }
      
      const query = `
        INSERT INTO public.users (name, age, address, additional_info)
        VALUES ${placeholders.join(',')}
      `;
      
      return await this.pool.query(query, values);
    } catch (error) {
      throw new Error(`Bulk database insertion failed: ${error.message}`);
    }
  }

  /**
   * Fetches all users from the database.
   * @returns {Promise<Array<IUser>>} Array of user objects.
   */
  async getAllUsers() {
    try {
      const result = await this.pool.query('SELECT name, age FROM public.users');
      return result.rows.map(row => ({
        name: row.name,
        age: row.age
      }));
    } catch (error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
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