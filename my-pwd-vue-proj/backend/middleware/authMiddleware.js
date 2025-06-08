// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import { pool } from '../config/database.js'; 



export const verifyAccessToken = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      const token = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({ success: false, message: 'Authorization token required' });
      }

      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

      if (!allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ success: false, message: 'Access denied. Role not authorized.' });
      }

      // Always query from the 'admins' table using admin_id and role
      const [rows] = await pool.promise().query(
        'SELECT 1 FROM admins WHERE admin_id = ? AND role = ?',
        [decoded.id, decoded.role]
      );

      if (rows.length === 0) {
        return res.status(403).json({ success: false, message: `Account with role '${decoded.role}' does not exist` });
      }

      req.user = decoded;
      next();
    } catch (error) {
      console.error('Token verification error:', error.message);

      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, message: 'Token expired' });
      }

      res.status(403).json({ success: false, message: 'Invalid token' });
    }
  };
};



//Old code
// export const verifyAccessToken = async (req, res, next) => {
//   try {
//     const token = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];

//     if (!token) {
//       return res.status(401).json({ 
//         success: false,
//         message: 'Authorization token required' 
//       });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

//     // Check if the user is an admin
//     if (decoded.role !== 'admin') {
//       return res.status(403).json({ 
//         success: false,
//         message: 'Access denied. Admins only.' 
//       });
//     }

//     const [rows] = await pool.promise().query(
//       'SELECT 1 FROM admins WHERE admin_id = ?',
//       [decoded.id]
//     );

//     if (rows.length === 0) {
//       return res.status(403).json({ 
//         success: false,
//         message: 'Admin account no longer exists' 
//       });
//     }

//     req.user = decoded;
//     next();
//   } catch (error) {
//     console.error('Token verification error:', error.message);

//     if (error.name === 'TokenExpiredError') {
//       return res.status(401).json({ 
//         success: false,
//         message: 'Token expired' 
//       });
//     }

//     res.status(403).json({ 
//       success: false,
//       message: 'Invalid token' 
//     });
//   }
// };





