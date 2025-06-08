import bcrypt from 'bcrypt';
import { pool } from './config/database.js';

const hashPasswords = async () => {
  try {
    // Hash admin passwords
    const [admins] = await pool.promise().query('SELECT admin_id, pass FROM admins');
    for (const admin of admins) {
      if (!admin.pass.startsWith('$2b$')) {
        const hashed = await bcrypt.hash(admin.pass, 10);
        await pool.promise().query(
          'UPDATE admins SET pass = ? WHERE admin_id = ?',
          [hashed, admin.admin_id]
        );
        console.log(`✅ Hashed pass for admin ID ${admin.admin_id}`);
      }
    }

    // Hash employee passs
    const [employees] = await pool.promise().query('SELECT employee_id, pass FROM employees');
    for (const emp of employees) {
      if (!emp.pass.startsWith('$2b$')) {
        const hashed = await bcrypt.hash(emp.pass, 10);
        await pool.promise().query(
          'UPDATE employees SET pass = ? WHERE employee_id = ?',
          [hashed, emp.employee_id]
        );
        console.log(`✅ Hashed pass for employee ID ${emp.employee_id}`);
      }
    }

    console.log('🎉 All plaintext passs hashed successfully.');
    process.exit();
  } catch (err) {
    console.error('❌ Error hashing passwords:', err);
    process.exit(1);
  }
};

hashPasswords();
