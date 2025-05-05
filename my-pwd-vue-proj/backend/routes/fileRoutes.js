// backend/routes/fileRoutes.js
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Optional: Replace with real admin auth
const isAdmin = (req, res, next) => {
    const isAdminUser = true; // ← Replace with your real check
    if (!isAdminUser) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  };
  
  // 🔐 Secure route to access documents
  router.get('/:type/:filename', isAdmin, (req, res) => {
    const { type, filename } = req.params;
  
    const folderMap = {
      '1x1_img': '1x1-ID',
      'birthcert_img': 'BirthCert',
      'brgycert_img': 'Brgycert',
      'votersreg_img': 'Votersreg',
      'govissue_img_1': 'Govissue1',
      'govissue_img_2': 'Govissue2',
      'med_cert' : 'MedCert',
    };
  
    const folder = folderMap[type];
    if (!folder) return res.status(400).json({ error: 'Invalid file type' });
  
    const filePath = path.join(__dirname, '..', 'Documents', folder, filename);
  
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }
  
    res.sendFile(filePath);
  });
  
  export default router;