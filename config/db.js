const { Pool } = require('pg');
// Database configuration
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'orgflow_db',
    password: 'password',
    port: 5432, // Default PostgreSQL port
  });

module.exports = pool;

