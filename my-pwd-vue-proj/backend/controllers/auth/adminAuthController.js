import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../../config/database.js';


// ✅ LOGIN (updated)
export const adminLogin = async (req, res) => {
  const { admin_id, pass } = req.body;

  try {
    // Case-sensitive admin check using BINARY keyword
    const [rows] = await pool.promise().query(
      'SELECT * FROM admins WHERE BINARY admin_id = ?',
      [admin_id]
    );

    const admin = rows[0];
    if (!admin) {
      return res.status(401).json({ 
        success: false,
        message: 'Admin not found. Check your credentials.' 
      });
    }

    // Check login attempts (case-sensitive)
    const [attemptRows] = await pool.promise().query(
      'SELECT * FROM admin_login_attempts WHERE BINARY admin_id = ?',
      [admin_id]
    );
    
    const attempt = attemptRows[0];
    const now = new Date();

    if (attempt?.locked_until && now < new Date(attempt.locked_until)) {
      const remainingMinutes = Math.ceil((new Date(attempt.locked_until) - now) / (60 * 1000));
      return res.status(429).json({ 
        success: false,
        message: `Account locked. Try again in ${remainingMinutes} minute(s).` 
      });
    }

    // Validate password
    const passwordValid = await bcrypt.compare(pass, admin.pass);
    if (!passwordValid) {
      let updatedAttempts = 1;
      let lockTime = null;
      
      // Update failed attempt counter
      if (attempt) {
        updatedAttempts = attempt.attempts + 1;
      
        if (updatedAttempts >= 20) {
          lockTime = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour lock
        } else if (updatedAttempts >= 20) {
          lockTime = new Date(now.getTime() + 60 * 1000); // 1 min lock
        }
      
        await pool.promise().query(
          'UPDATE admin_login_attempts SET attempts = ?, locked_until = ? WHERE BINARY admin_id = ?',
          [updatedAttempts, lockTime, admin_id]
        );
      } else {
        await pool.promise().query(
          'INSERT INTO admin_login_attempts (admin_id, attempts) VALUES (?, ?)',
          [admin_id, 1]
        );
      }

      return res.status(401).json({ 
        success: false,
        message: 'Invalid password',
        attempts: updatedAttempts,
        locked: !!lockTime
      });
    }

    // Successful login - reset attempts
    if (attempt) {
      await pool.promise().query(
        'DELETE FROM admin_login_attempts WHERE BINARY admin_id = ?',
        [admin_id]
      );
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { id: admin.admin_id, role: 'admin' }, 
      process.env.JWT_ACCESS_SECRET, 
      { expiresIn: process.env.ACCESS_TOKEN_EXP }
    );

    const refreshToken = jwt.sign(
      { id: admin.admin_id, role: 'admin' },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXP }
    );

    await pool.promise().query(
      'INSERT INTO admin_refresh_tokens (admin_id, token, created_at, expires_at) VALUES (?, ?, ?, ?)',
      [
        admin.admin_id,
        refreshToken,
        new Date(), // current time
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // expires in 7 days
      ]
    );
    

    const { pass: _, ...safeAdmin } = admin;

    res
      .cookie('accessToken', accessToken, { 
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 15 * 60 * 1000 // 15 minutes
      })
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      })
      .json({ 
        success: true,
        message: 'Login successful',
        user: safeAdmin,
      });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error during login' 
    });
  }
};


// ✅ REFRESH
export const refresh = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(403).json({ message: 'Missing refresh token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    // 🔍 Check if refresh token exists in DB
    const [rows] = await pool.promise().query(
      'SELECT * FROM admin_refresh_tokens WHERE admin_id = ? AND token = ?',
      [decoded.id, token]
    );

    if (rows.length === 0) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    const newAccessToken = jwt.sign({ id: decoded.id, role: 'admin' }, process.env.JWT_ACCESS_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_EXP,
    });

    res
      .cookie('accessToken', newAccessToken, { httpOnly: true, maxAge: 15 * 60 * 1000 })
      .json({ message: 'Access token refreshed' });

  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
};

// ✅ LOGOUT
export const logout = async (req, res) => {
  const token = req.cookies.refreshToken;

  try {
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

      // 🗑️ Delete token from DB
      await pool.promise().query(
        'DELETE FROM admin_refresh_tokens WHERE admin_id = ? AND token = ?',
        [decoded.id, token]
      );
    }
  } catch (e) {
    console.error('Logout error:', e.message);
  }

  res
    .clearCookie('accessToken')
    .clearCookie('refreshToken')
    .json({ message: 'Logged out' });
};

// ✅ CHECK IF ADMIN EXISTS (FOR VALIDATION PURPOSES)
export const checkAdminExists = async (req, res) => {
  const { admin_id } = req.body;

  try {
    const [rows] = await pool.promise().query(
      'SELECT 1 FROM admins WHERE admin_id = ?',
      [admin_id]
    );

    const exists = rows.length > 0;
    res.json({ exists });
  } catch (err) {
    console.error('Check Admin Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};




// // ✅ LOGIN
// export const adminLogin = async (req, res) => {
//   const { admin_id, pass } = req.body;

//   try {
//     const [rows] = await pool.promise().query(
//       'SELECT * FROM admins WHERE admin_id = ?',
//       [admin_id]
//     );

//     const admin = rows[0];
//     if (!admin || !(await bcrypt.compare(pass, admin.pass))) {
//       return res.status(401).json({ message: 'Invalid admin_id or password' });
//     }

//     const accessToken = jwt.sign({ id: admin.admin_id }, process.env.JWT_ACCESS_SECRET, {
//       expiresIn: process.env.ACCESS_TOKEN_EXP,
//     });

//     const refreshToken = jwt.sign({ id: admin.admin_id }, process.env.JWT_REFRESH_SECRET, {
//       expiresIn: process.env.REFRESH_TOKEN_EXP,
//     });

//     // 🗂️ Store refresh token in MySQL
//     await pool.promise().query(
//       'INSERT INTO admin_refresh_tokens (admin_id, token) VALUES (?, ?)',
//       [admin.admin_id, refreshToken]
//     );

//     const { pass: adminPass, ...safeAdmin } = admin; // Rename to 'adminPass'
//     if (!admin || !(await bcrypt.compare(pass, adminPass))) { // Use 'adminPass' here
//       return res.status(401).json({ message: 'Invalid admin_id or password' });
//     }

//     res
//       .cookie('accessToken', accessToken, { httpOnly: true, maxAge: 15 * 60 * 1000 })
//       .cookie('refreshToken', refreshToken, {
//         httpOnly: true,
//         secure: true,
//         sameSite: 'strict',
//         maxAge: 7 * 24 * 60 * 60 * 1000,
//       })
//       .json({ message: 'Login successful', user: safeAdmin });

//   } catch (err) {
//     console.error('Admin Login Error:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };
