// routes/auth/employeeAuthRoutes.js
import express from 'express';
import { 
  employeeLogin, 
  refreshEmployeeToken as refresh, 
  logoutEmployee as logout, 
  checkEmployeeExists 
} from '../../controllers/auth/employeeAuthController.js';

const router = express.Router();

router.post('/login', employeeLogin);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/check-employee', checkEmployeeExists);

export default router;