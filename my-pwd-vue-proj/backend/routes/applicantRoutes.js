import express from "express";
import multer from 'multer';
import { pool } from '../config/database.js';
import fs from 'fs';
import { broadcastToClients } from '../websocketServer.js';

const router = express.Router();

/*********Pending Applicants endpoints*********/

// GET all pending applications
router.get('/pending', async (req, res) => {
  const [rows] = await pool.promise().query(`SELECT * FROM pending_applications`);
  res.json(rows);
});

// Approve
router.put('/pending/:id/approve', async (req, res) => {
  const id = req.params.id;


  await pool.promise().query(`
    UPDATE pending_applications 
    SET application_status = 'approved', evaluated_at = NOW() 
    WHERE id = ?
  `, [id]);

  res.sendStatus(200);
});

// Reject
router.put('/pending/:id/reject', async (req, res) => {
  const id = req.params.id;
  await pool.promise().query(`
    UPDATE pending_applications 
    SET application_status = 'rejected', evaluated_at = NOW() 
    WHERE id = ?
  `, [id]);

  res.sendStatus(200);
});


// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderMap = {
      '1x1_img': 'Documents/1x1-ID',
      'birthcert_img': 'Documents/BirthCert',
      'brgycert_img': 'Documents/Brgycert',
      'votersreg_img': 'Documents/Votersreg',
      'govissue_img_1': 'Documents/Govissue1',
      'govissue_img_2': 'Documents/Govissue2'
    };

    const targetFolder = folderMap[file.fieldname] || 'Documents/OtherDocs';

    // Ensure the folder exists before saving (important!)
    fs.mkdirSync(targetFolder, { recursive: true });

    cb(null, targetFolder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

  const upload = multer({ storage });
  
  const cpUpload = upload.fields([
    { name: 'birthcert_img', maxCount: 1 },
    { name: 'brgycert_img', maxCount: 1 },
    { name: 'votersreg_img', maxCount: 1 },
    { name: 'govissue_img_1', maxCount: 1 },
    { name: 'govissue_img_2', maxCount: 1 },
    { name: '1x1_img', maxCount: 1 }
  ]);
  
  
  router.post('/pending', cpUpload, async (req, res) => {
    try {
      const {
        first_name, middle_name, surname, full_name, email, sex, birthdate, age, address,
        contact_number, civil_status, employment_status, parent_guardian, types_of_disability,
        disability_cause, assistive_device, remarks, annotation,
        philhealth_no, bloodType, education  
      } = req.body;
  
      const files = req.files;
  
      // ✅ Move folderMap into here so getPath can access it
      const folderMap = {
        '1x1_img': 'Documents/1x1-ID',
        'birthcert_img': 'Documents/BirthCert',
        'brgycert_img': 'Documents/Brgycert',
        'votersreg_img': 'Documents/Votersreg',
        'govissue_img_1': 'Documents/Govissue1',
        'govissue_img_2': 'Documents/Govissue2'
      };
  
      // ✅ Define getPath AFTER files is available
      const getPath = (field, fallback = null) => {
        const folder = folderMap[field] || 'Documents/OtherDocs';
        const file = files?.[field]?.[0]?.filename;
        return file ? `${folder}/${file}` : fallback;
      };
  
      const query = `
      INSERT INTO pending_applications (
        first_name, middle_name, surname, full_name,
        email, sex, birthdate, age, address,
        contact_number, civil_status, employment_status, parent_guardian,
        types_of_disability, disability_cause, assistive_device,
        remarks, annotation,
        philhealth_no, bloodType, education,
        is_renewal, application_status,
        birthcert_img, brgycert_img, votersreg_img, govissue_img_1, govissue_img_2, 1x1_img
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 'pending', ?, ?, ?, ?, ?, ?)
      `;
  
      const submittedTime = new Date();
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000); // 🛠️ MODIFY MINUTES HERE

      if (submittedTime >= tenMinutesAgo) {
        broadcastToClients({
          event: "recent-applicant",
          data: {
            full_name,
            age,
            types_of_disability,
            submitted_at: submittedTime
          }
        });
      }
      
      await pool.promise().query(query, [
        first_name, middle_name, surname, full_name,
        email, sex,
        birthdate && birthdate !== 'null' ? birthdate : null,
        age, address,
        contact_number, civil_status, employment_status, parent_guardian,
        types_of_disability, disability_cause, assistive_device,
        remarks, annotation,
        philhealth_no, bloodType, education,
        getPath('birthcert_img'),
        getPath('brgycert_img'),
        getPath('votersreg_img'),
        getPath('govissue_img_1'),
        getPath('govissue_img_2'),
        getPath('1x1_img')
      ]);
      
      const [countRows] = await pool.promise().query(
        `SELECT COUNT(*) as count FROM pending_applications WHERE application_status = 'pending'`
      );

      broadcastToClients({
        event: "processing-applications-count",
        data: { count: countRows[0].count }
      });

      broadcastToClients({
        event: "new-applicant",
        data: {
          full_name,
          age,
          types_of_disability,
          submitted_at: new Date().toISOString() // ✅ Include timestamp for filtering
        }
      });      
      
      res.status(201).json({ message: 'Application submitted!' });
  
    } catch (err) {
      console.error('Error saving application:', err);
      res.status(500).json({ error: 'Failed to submit application.' });
    }
  });
  
  // ✅ New route to get total pending applications
router.get('/pending/count', async (req, res) => {
  try {

    console.log("🔥 /pending/count endpoint hit");

    const [rows] = await pool.promise().query(`
      SELECT COUNT(*) AS count
      FROM pending_applications
      WHERE application_status = 'pending'
    `);
    res.json({ count: rows[0].count });
  } catch (err) {
    console.error('Error fetching pending count:', err);
    res.status(500).json({ error: 'Failed to fetch pending count.' });
  }
});



  // ✅ Route: GET /api/applicants/pending/recent
  router.get('/pending/recent', async (req, res) => {
    try {
    // Example: http://localhost:4000/api/applicants/pending/recent?hours=24&limit=5
    // const hours = req.query.hours || 48;
    const hours = 48;
    const limit = req.query.limit || 10;
    const [results] = await pool.promise().query(
      `SELECT full_name, age, types_of_disability, submitted_at
      FROM pending_applications
      WHERE submitted_at >= NOW() - INTERVAL ? HOUR
      ORDER BY submitted_at DESC
      LIMIT ?`,
      [hours, limit]
    );

      res.json(results);
    } catch (err) {
      console.error('Error fetching recent applicants:', err);
      res.status(500).json({ error: 'Failed to fetch recent applicants.' });
    }
  });


  export default router;