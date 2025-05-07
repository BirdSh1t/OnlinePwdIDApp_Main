import { pool } from '../config/database.js';
import { broadcastToClients } from '../websocketServer.js';


const approveApplicant = async (req, res) => {
  const applicantId = req.params.id; // Get from URL params
  const conn = await pool.promise().getConnection();
  

  try {
    await conn.beginTransaction();
    

    // STEP 1: Duplicate Check
    const [existing] = await conn.query(
      `SELECT * FROM users 
       WHERE email = (
         SELECT email 
         FROM pending_applications 
         WHERE id = ?
       )`,
      [applicantId]
    );

    if (existing.length > 0) {
      await conn.rollback();
      return res.status(400).json({ 
        warning: 'Applicant already exists in users table' // ✅ Just return a plain object
      });
    }
    
    // STEP 2: Mark as Approved
    await conn.query(
      `UPDATE pending_applications 
       SET application_status = 'approved',
       evaluated_at = NOW()
       WHERE id = ?`,
      [applicantId]
    );

    // STEP 3: Generate Unique PWD ID
    let pwdId;
    let isUnique = false;
    const generatePwdId = () => {
      const first = Math.floor(100 + Math.random() * 900); // 3 digits
      const second = Math.floor(1000 + Math.random() * 9000); // 4 digits
      return `${first}-${second}`;
    };

    while (!isUnique) {
      pwdId = generatePwdId();
      const [rows] = await conn.query(
        `SELECT pwd_id 
         FROM users 
         WHERE pwd_id = ? 
         LIMIT 1`,
        [pwdId]
      );
      if (rows.length === 0) isUnique = true;
    }

    // STEP 4: Generate num_users
    const [maxNumUsersRow] = await conn.query(
      `SELECT MAX(num_users) AS maxNum FROM users FOR UPDATE`
    );
    const nextNumUsers = (maxNumUsersRow[0].maxNum || 0) + 1;

    // STEP 5: Check if it's a renewal
    const [renewalRows] = await conn.query(
      `SELECT * FROM pending_applications WHERE id = ? AND application_status = 'approved' AND is_renewal = 1`,
      [applicantId]
    );

    if (renewalRows.length === 0) {
      // ✅ INSERT logic for new applicants
      const insertSql = `
        INSERT INTO users (
          num_users, pwd_id, first_name, middle_name, surname, full_name,
          email, contact_number, sex, birthdate, address,
          types_of_disability, disability_cause, assistive_device,
          civil_status, employment_status, parent_guardian, philhealth_no,
          blood_type, education, status_, is_renewal, application_type,
          1x1_img, birthcert_img, brgycert_img,
          votersreg_img, govissue_img_1, govissue_img_2, med_cert,
          member_since, date_issued, remarks, annotation
        )
        SELECT
          ?, ?, first_name, middle_name, surname, full_name,
          email, contact_number, sex, birthdate, address,
          types_of_disability, disability_cause, assistive_device,
          civil_status, employment_status, parent_guardian, philhealth_no,
          bloodType AS blood_type, education, 'valid', is_renewal,
          'online',
          \`1x1_img\`, birthcert_img, brgycert_img,
          votersreg_img, govissue_img_1, govissue_img_2, med_cert,
          CURDATE(), CURDATE(), remarks, annotation
        FROM pending_applications
        WHERE id = ?
          AND application_status = 'approved'
          AND is_renewal = 0
      `;
    
      const [result] = await conn.query(insertSql, [
        nextNumUsers,
        pwdId,
        applicantId
      ]);
    
      if (result.affectedRows === 0) {
        throw new Error('Failed to insert into users table');
      }
    } else {
      // ✅ UPDATE logic for renewals
      const renewal = renewalRows[0];
    
      const [existingUserRows] = await conn.query(
        `SELECT * FROM users WHERE pwd_id = ?`,
        [renewal.pwd_id]
      );
    
      if (existingUserRows.length === 0) {
        throw new Error('No matching user found for this PWD ID during renewal');
      }
    
      await conn.query(
        `UPDATE users SET 
          first_name = ?, middle_name = ?, surname = ?, full_name = ?,
          email = ?, contact_number = ?, sex = ?, birthdate = ?, address = ?,
          types_of_disability = ?, disability_cause = ?, assistive_device = ?,
          civil_status = ?, employment_status = ?, parent_guardian = ?, philhealth_no = ?,
          blood_type = ?, education = ?, status_ = 'valid', is_renewal = 1,
          application_type = 'online', 
          \`1x1_img\` = ?, birthcert_img = ?, brgycert_img = ?,
          votersreg_img = ?, govissue_img_1 = ?, govissue_img_2 = ?, med_cert = ?,
          remarks = ?, annotation = ?
        WHERE pwd_id = ?`,
        [
          renewal.first_name, renewal.middle_name, renewal.surname, renewal.full_name,
          renewal.email, renewal.contact_number, renewal.sex, renewal.birthdate, renewal.address,
          renewal.types_of_disability, renewal.disability_cause, renewal.assistive_device,
          renewal.civil_status, renewal.employment_status, renewal.parent_guardian, renewal.philhealth_no,
          renewal.bloodType, renewal.education,
          renewal[`1x1_img`], renewal.birthcert_img, renewal.brgycert_img,
          renewal.votersreg_img, renewal.govissue_img_1, renewal.govissue_img_2, renewal.med_cert,
          renewal.remarks, renewal.annotation,
          renewal.pwd_id
        ]
      );
    }
    

    // STEP 7: Set Expiration
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await conn.query(
      `UPDATE pending_applications 
       SET expires_at = ? 
       WHERE id = ?`,
      [expiresAt, applicantId]
    );

    // STEP 8: Get Online Count
    const [onlineRows] = await conn.query(
      `SELECT COUNT(*) as count 
       FROM users 
       WHERE application_type = 'online' 
         AND is_renewal = 0`
    );
    const onlineCount = onlineRows[0].count;

    // Final Commit & Notifications
    await conn.commit();

    broadcastToClients({
      event: 'applicantApproved',
      data: { id: applicantId }
    });

    broadcastToClients({
      event: 'online-applicant-count',
      data: { count: onlineCount }
    });

    res.status(200).json({ 
      message: 'Applicant approved successfully',
      pwdId: pwdId,
      numUsers: nextNumUsers
    });

  } catch (err) {
    await conn.rollback();
    console.error('❌ Approval Error:', err);
    res.status(500).json({ 
      error: 'Approval failed',
      details: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  } finally {
    conn.release();
  }
};

export { approveApplicant };
