import express from 'express';
import {
  adminLogin,
  refresh,
  logout,
  checkAdminExists
} from '../../controllers/auth/adminAuthController.js';

const router = express.Router();

// POST /api/auth/admin/login
router.post('/login', adminLogin);

// POST /api/auth/admin/check-admin ✅ This is the one you were missing
router.post('/check-admin', checkAdminExists);

// POST /api/auth/admin/refresh
router.post('/refresh', refresh);

// POST /api/auth/admin/logout
router.post('/logout', logout);

export default router;
