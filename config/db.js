import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let pool;

const connectDB = async () => {
  try {
    pool = await mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'your_database_name',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Test connection
    const [rows] = await pool.query('SELECT 1');
    console.log('MySQL connected');
  } catch (err) {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  }
};

// Export the pool and connectDB
export { pool };
export default connectDB;
