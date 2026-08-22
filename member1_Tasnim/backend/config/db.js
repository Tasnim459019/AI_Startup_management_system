require('dotenv').config();
const mysql = require('mysql2');

// SINGLETON PATTERN
// Only one database connection instance is ever created for the entire application.
// Every file that needs the database imports this same instance via module.exports,
// instead of each file creating its own separate connection.
class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }

    this.connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
    });

    this.connection.connect((err) => {
      if (err) {
        console.error('❌ Database connection failed:', err.message);
        return;
      }
      console.log('✅ Connected to MySQL database!');
    });

    Database.instance = this;
  }

  getConnection() {
    return this.connection;
  }
}

const dbInstance = new Database();
module.exports = dbInstance.getConnection();
