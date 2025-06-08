import express from 'express';
import { verifyAccessToken } from '../middleware/authMiddleware.js'; // Note the .js extension
import { pool } from '../config/database.js'; 

const router = express.Router();


// DASHBOARD (admin & employee)
router.get(
  '/dashboard',
  verifyAccessToken(['admin', 'employee']),
  async (req, res) => {
    try {
      const [rows] = await pool
        .promise()
        .query('SELECT * FROM users WHERE id = ?', [req.user.id]);
      res.json({ success: true, user: rows[0] });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// DATABASE PAGE (admin & employee)
router.get(
  '/database',
  verifyAccessToken(['admin', 'employee']),
  async (req, res) => {
    try {
      const [rows] = await pool.promise().query('SELECT * FROM users');
      res.json({ success: true, users: rows });
    } catch (err) {
      console.error('Error fetching database records:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// CREATE PAGE (admin & employee)
router.post(
  '/applications/create',
  verifyAccessToken(['admin', 'employee']),
  async (req, res) => {
    try {
      const {
        first_name,
        middle_name,
        surname,
        address,
        birthdate,
        contact_number,
        civil_status,
        employment_status,
        types_of_disability,
        bloodType,
        education,
        philhealth_no,
      } = req.body;

      await pool.promise().query(
        `INSERT INTO pending_applications 
         (first_name, middle_name, surname, address, birthdate, contact_number, civil_status, employment_status, 
          types_of_disability, bloodType, education, philhealth_no) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          first_name,
          middle_name,
          surname,
          address,
          birthdate,
          contact_number,
          civil_status,
          employment_status,
          types_of_disability,
          bloodType,
          education,
          philhealth_no,
        ]
      );

      res.json({ success: true, message: 'Application submitted successfully' });
    } catch (err) {
      console.error('Error creating application:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// PENDING APPLICATIONS PAGE (admin & employee)
router.get(
  '/applications/pending',
  verifyAccessToken(['admin', 'employee']),
  async (req, res) => {
    try {
      const { type } = req.query; // 'new' or 'renewal'
      let renewalFilter = '';
      if (type === 'new') renewalFilter = 'AND is_renewal = 0';
      else if (type === 'renewal') renewalFilter = 'AND is_renewal = 1';

      const [rows] = await pool
        .promise()
        .query(
          `SELECT * FROM pending_applications 
           WHERE is_approved = 0 AND is_rejected = 0 ${renewalFilter}
           ORDER BY created_at DESC`
        );
      res.json({ success: true, applications: rows });
    } catch (err) {
      console.error('Error fetching pending applications:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// ARCHIVE PAGE (admin only)
router.get(
  '/archive',
  verifyAccessToken(['admin']),
  async (req, res) => {
    try {
      const [rows] = await pool
        .promise()
        .query(
          'SELECT * FROM users WHERE archived_at IS NOT NULL ORDER BY archived_at DESC'
        );
      res.json({ success: true, data: rows });
    } catch (err) {
      console.error('Error fetching archive data:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);




// router.get('/dashboard', verifyAccessToken, async (req, res) => {
//   const [rows] = await pool.promise().query('SELECT * FROM users WHERE id = ?', [req.user.id]);
//   res.json(rows[0]);
// });


// router.get('/auth/admin/profile', verifyAccessToken, async (req, res) => {
//   try {
//     const [rows] = await pool.promise().query(
//       'SELECT admin_id, admin_name, email FROM admins WHERE admin_id = ?',
//       [req.user.id]
//     )

//     if (rows.length === 0) {
//       return res.status(404).json({ message: 'Admin not found' })
//     }

//     res.json({ success: true, admin: rows[0] })
//   } catch (err) {
//     console.error('Error fetching admin profile:', err.message)
//     res.status(500).json({ message: 'Server error' })
//   }
// })

export default router; // Replace module.exports