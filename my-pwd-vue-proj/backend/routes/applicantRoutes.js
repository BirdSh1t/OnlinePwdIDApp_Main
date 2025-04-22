import express from "express";
import multer from 'multer';
import { pool } from '../config/database.js';
import { broadcastToClients } from '../websocketServer.js';

const router = express.Router();

// Multer storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
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
        disability_cause, assistive_device, remarks, annotation
      } = req.body;
  
      const files = req.files;
  
      const query = `
        INSERT INTO pending_applications (
          first_name, middle_name, surname, full_name,
          email, sex, birthdate, age, address,
          contact_number, civil_status, employment_status, parent_guardian,
          types_of_disability, disability_cause, assistive_device,
          remarks, annotation,
          is_renewal, application_status,
          birthcert_img, brgycert_img, votersreg_img, govissue_img_1, govissue_img_2, 1x1_img
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 'pending', ?, ?, ?, ?, ?, ?)
      `;
  
      await pool.promise().query(query, [
        first_name, middle_name, surname, full_name,
        email, sex, birthdate, age, address,
        contact_number, civil_status, employment_status, parent_guardian,
        types_of_disability, disability_cause, assistive_device,
        remarks, annotation,
        files?.birthcert_img?.[0]?.filename || null,
        files?.brgycert_img?.[0]?.filename || null,
        files?.votersreg_img?.[0]?.filename || null,
        files?.govissue_img_1?.[0]?.filename || null,
        files?.govissue_img_2?.[0]?.filename || null,
        files?.['1x1_img']?.[0]?.filename || null
      ]);
  
      res.status(201).json({ message: 'Application submitted!' });
    } catch (err) {
      console.error('Error saving application:', err);
      res.status(500).json({ error: 'Failed to submit application.' });
    }
  });
  
  

  export default router;