import express from 'express';
import { pool } from '../config/database.js';

const router = express.Router();

// ✅ Login Route


router.post('/check-admin', async (req, res) => {
    const { admin_id } = req.body;
  
    try {
      // ✅ FIX: Use .promise() here too
      const [results] = await pool.promise().query(
        'SELECT * FROM admins WHERE admin_id = ?', 
        [admin_id]
      );
  
      res.json({ exists: results.length > 0 });
    } catch (err) {
      console.error('❌ Check Admin Error:', err);
      res.status(500).json({ exists: false });
    }
  });
  

router.post('/LandingPage', async (req, res) => {
    const { admin_id, pass } = req.body;

    console.log("Received login:", { admin_id, pass }); // 👀 See what you got

    try {
        const [rows] = await pool.promise().query(
            "SELECT * FROM admins WHERE BINARY admin_id = ? AND BINARY pass = ?", 
            [admin_id, pass] 
        );

        if (rows.length > 0) {
            res.json({ success: true, message: "Login successful", user: rows[0] });
        } else {
            res.status(401).json({ success: false, message: "Invalid admin_id or password" });
        }
    } catch (error) {
        console.error("❌ Login Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});     

export default router;

// ✅ CHECK ADMIN ID ONLY
// router.post('/check-admin-id', async (req, res) => {
//     const { admin_id } = req.body;
  
//     try {
//       const [rows] = await pool.promise().query(
//         "SELECT admin_id FROM admins WHERE BINARY admin_id = ?",
//         [admin_id]
//       );
  
//       res.json({ exists: rows.length > 0 });
//     } catch (error) {
//       console.error("❌ Check Admin ID Error:", error);
//       res.status(500).json({ exists: false, message: "Server error" });
//     }
//   });
  
//   // ✅ LOGIN
//   router.post('/Login', async (req, res) => {
//     const { admin_id, pass } = req.body;
  
//     try {
//       const [rows] = await pool.promise().query(
//         "SELECT * FROM admins WHERE BINARY admin_id = ? AND BINARY pass = ?",
//         [admin_id, pass]
//       );
  
//       if (rows.length > 0) {
//         res.json({ success: true, message: "Login successful", user: rows[0] });
//       } else {
//         res.status(401).json({ success: false, message: "Invalid credentials" });
//       }
//     } catch (error) {
//       console.error("❌ Login Error:", error);
//       res.status(500).json({ success: false, message: "Server error" });
//     }
//   });
  