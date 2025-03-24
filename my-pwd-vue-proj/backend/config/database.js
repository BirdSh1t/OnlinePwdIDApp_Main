import mysql2 from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql2.createPool({
    host: process.env.DB_HOST,     
    port: Number(process.env.DB_PORT),     
    user: process.env.DB_USER,      
    password: process.env.DB_PASSWORD,  
    database: process.env.DB_DATABASE,
    connectionLimit: 4,
    queueLimit: 6,
    waitForConnections: true
});

const checkConnection = async () => {
  try {
      const connection = await pool.promise().getConnection();
      console.log("✅ Database Connection Successful!");
      connection.release();
  } catch (error) {
      console.error(`❌ Database Connection Failed: ${error.code} - ${error.message}`);
      throw error;
  }
};

export { pool, checkConnection };
