import express from 'express';
import { pool } from '../config/database.js';

const router = express.Router();

// ✅ Login Route
router.post('/login', async (req, res) => {
    const { username, pass } = req.body;

    try {
        const [rows] = await pool.promise().query(
            "SELECT * FROM admins WHERE BINARY username = ? AND BINARY pass = ?", 
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

export default router;
