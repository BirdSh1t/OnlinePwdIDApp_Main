import express from 'express';
import { pool } from './config/database.js'; // ✅ Import MySQL connection
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';

const app = express(); 

// ✅ Middleware
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(express.json()); 

// ✅ Login Route
app.post('/api/login', async (req, res) => {
    const { username, pass } = req.body; 

    try {
        const [rows] = await pool.promise().query(
            "SELECT * FROM employees WHERE BINARY username = ? AND BINARY pass = ?", 
            [username, pass] 
        );

        if (rows.length > 0) {
            res.json({ success: true, message: "Login successful", user: rows[0] });
        } else {
            res.status(401).json({ success: false, message: "Invalid username or password" });
        }
    } catch (error) {
        console.error("❌ Login Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
