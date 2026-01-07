// Database initialization script
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'dealer_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
});

async function initDatabase() {
  try {
    console.log('Connecting to PostgreSQL...');
    
    // Read and execute schema
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    await pool.query(schema);
    console.log('✅ Database schema created successfully!');
    
    // Create admin user (optional)
    const bcrypt = require('bcryptjs');
    const adminPassword = process.env.ADMIN_PASSWORD || 'PascualParedes2025';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    await pool.query(
      `INSERT INTO users (username, email, password_hash, is_admin) 
       VALUES ($1, $2, $3, $4) 
       ON CONFLICT (username) DO NOTHING`,
      ['Pascual', 'admin@dealer.com', hashedPassword, true]
    );
    console.log('✅ Admin user created (if not exists)');
    
    await pool.end();
    console.log('✅ Database initialization complete!');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
}

initDatabase();

