import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../../config/database.js';

// ✅ EMPLOYEE LOGIN
export const employeeLogin = async (req, res) => {
  const { admin_id, pass } = req.body;

  try {
    // Case-sensitive check
    const [rows] = await pool.promise().query(
      'SELECT * FROM admins WHERE BINARY admin_id = ?',
      [admin_id]
    );

    const employee = rows[0];
    if (!employee) {
      return res.status(401).json({ 
        success: false,
        message: 'Employee not found. Check your credentials.'
      });
    }

    // Check login attempts
    const [attemptRows] = await pool.promise().query(
      'SELECT * FROM employee_login_attempts WHERE BINARY admin_id = ?',
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
    const passwordValid = await bcrypt.compare(pass, employee.pass);
    if (!passwordValid) {
      let updatedAttempts = 1;
      let lockTime = null;

      if (attempt) {
        updatedAttempts = attempt.attempts + 1;

        if (updatedAttempts >= 20) {
          lockTime = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour lock
        } else if (updatedAttempts >= 10) {
          lockTime = new Date(now.getTime() + 60 * 1000); // 1 min lock
        }

        await pool.promise().query(
          'UPDATE employee_login_attempts SET attempts = ?, locked_until = ? WHERE BINARY admin_id = ?',
          [updatedAttempts, lockTime, admin_id]
        );
      } else {
        await pool.promise().query(
          'INSERT INTO employee_login_attempts (admin_id, attempts) VALUES (?, ?)',
          [admin_id, 1]
        );
      }

      return res.status(401).json({ 
        success: false,
        message: 'Invalid password',
        attempts: updatedAttempts,
        locked: !!lockTime,
        lockedUntil: lockTime
      });      
    }

    // Successful login: clear attempts
    if (attempt) {
      await pool.promise().query(
        'DELETE FROM employee_login_attempts WHERE BINARY admin_id = ?',
        [admin_id]
      );
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { id: employee.admin_id, role: 'employee' },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXP }
    );

    const refreshToken = jwt.sign(
      { id: employee.admin_id, role: 'employee' },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXP }
    );

    await pool.promise().query(
      'INSERT INTO employee_refresh_tokens (admin_id, token) VALUES (?, ?)',
      [employee.admin_id, refreshToken]
    );

    const { pass: _, ...safeEmployee } = employee;

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
        user: {
          ...safeEmployee,
          role: 'employee' // ✅ Add the role here
        }
      });
      

  } catch (err) {
    console.error('Employee login error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error during login' 
    });
  }
};

// ✅ REFRESH TOKEN
export const refreshEmployeeToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(403).json({ message: 'Missing refresh token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const [rows] = await pool.promise().query(
      'SELECT * FROM employee_refresh_tokens WHERE admin_id = ? AND token = ?',
      [decoded.id, token]
    );

    if (rows.length === 0) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    const newAccessToken = jwt.sign(
      { id: decoded.id, role: 'employee' },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXP }
    );

    res
      .cookie('accessToken', newAccessToken, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000
      })
      .json({ message: 'Access token refreshed' });

  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
};

// ✅ LOGOUT
export const logoutEmployee = async (req, res) => {
  const token = req.cookies.refreshToken;

  try {
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

      await pool.promise().query(
        'DELETE FROM employee_refresh_tokens WHERE admin_id = ? AND token = ?',
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

// ✅ CHECK IF EMPLOYEE EXISTS
export const checkEmployeeExists = async (req, res) => {
  const { admin_id } = req.body;

  try {
    const [rows] = await pool.promise().query(
      'SELECT 1 FROM admins WHERE admin_id = ?',
      [admin_id]
    );

    const exists = rows.length > 0;
    res.json({ exists });
  } catch (err) {
    console.error('Check Employee Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
