import express from "express";
import { pool } from '../config/database.js';
import { broadcastToClients } from '../websocketServer.js';
import { approveApplicant } from '../controllers/adminController.js';

const router = express.Router();

// GET endpoints (unchanged)
router.get("/users/pwd-list", async (req, res) => {
  try {
    const query = "SELECT full_name, address, sex, date_issued FROM users";
    const [results] = await pool.promise().query(query);
    res.json(results);
  } catch (error) {
    console.error("Error fetching PWD list users:", error);
    res.status(500).json({ error: error.message });
  }
});

// Display data on report page
router.get("/users", async (req, res) => {
  try {
    const { archived } = req.query;
    let query = `
      SELECT 
        num_users AS user_number, full_name, address, sex, 
        pwd_id, status_ AS status, date_issued, 
        types_of_disability, birthdate, blood_type, transfer_from, care_of, 
        first_name, middle_name, surname, barangay, member_since,
        education, disability_cause, parent_guardian, contact_number,
        remarks, philhealth_no, assistive_device, occupation, annotation,
        1x1_img, votersreg_img, birthcert_img, brgycert_img, 
        govissue_img_1, govissue_img_2 
      FROM users
    `;

    const queryParams = [];

    // Only apply filter if archived param is provided
    if (archived !== undefined) {
      query += " WHERE is_archived = ?";
      queryParams.push(archived);
    }

    query += " ORDER BY num_users ASC";

    const [results] = await pool.promise().query(query, queryParams);
    res.json(results);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: error.message });
  }
});

// Archive
router.put("/users/:id/archive", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.promise().query(
      `UPDATE users SET is_archived = 1, archived_at = NOW() WHERE pwd_id = ?`,
      [id]
    );

    const [updatedActiveUsers] = await pool.promise().query(`
      SELECT num_users AS user_number, full_name, address, sex, pwd_id, status_ AS status, date_issued 
      FROM users 
      WHERE is_archived = 0
      ORDER BY num_users ASC
    `);

    const [updatedArchivedUsers] = await pool.promise().query(`
      SELECT num_users, full_name, address, sex, types_of_disability, archived_at, pwd_id
      FROM users
      WHERE is_archived = 1
      ORDER BY num_users ASC
    `);

    // ✅ 1. Update active and archived
    broadcastToClients({ event: "update-active", data: updatedActiveUsers });
    broadcastToClients({ event: "update-archived", data: updatedArchivedUsers });

    // ✅ 2. Fetch next ID again after archive
    const [nextIdResult] = await pool.promise().query('SELECT MAX(num_users) AS maxNum FROM users');
    const nextId = (nextIdResult[0].maxNum || 0) + 1;

    broadcastToClients({
      event: 'next-id-update',
      data: { nextId }
    });

    res.sendStatus(200);
  } catch (e) {
    res.status(500).send(e);
  }
});



// Unarchive
router.put("/users/:id/unarchive", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.promise().query(
      `UPDATE users SET is_archived = 0, archived_at = NULL WHERE pwd_id = ?`,
      [id]
    );

    const [updatedActiveUsers] = await pool.promise().query(`
      SELECT num_users AS user_number, full_name, address, sex, pwd_id, status_ AS status, date_issued 
      FROM users 
      WHERE is_archived = 0
      ORDER BY num_users ASC
    `);

    const [updatedArchivedUsers] = await pool.promise().query(`
      SELECT num_users, full_name, address, sex, types_of_disability, archived_at, pwd_id
      FROM users
      WHERE is_archived = 1
      ORDER BY num_users ASC
    `);

    // ✅ 1. Update active and archived
    broadcastToClients({ event: "update-active", data: updatedActiveUsers });
    broadcastToClients({ event: "update-archived", data: updatedArchivedUsers });

    // ✅ 2. Fetch next ID again after unarchive
    const [nextIdResult] = await pool.promise().query('SELECT MAX(num_users) AS maxNum FROM users');
    const nextId = (nextIdResult[0].maxNum || 0) + 1;

    broadcastToClients({
      event: 'next-id-update',
      data: { nextId }
    });

    res.sendStatus(200);
  } catch (e) {
    res.status(500).send(e);
  }
});



router.get("/pwd-forms", async (req, res) => {
  const archived = req.query.archived === "1" ? 1 : 0;
  const sql = `
    SELECT
    num_users,
    full_name,
    sex,
    status_ AS status,
    pwd_id,
    types_of_disability,
    archived_at
  FROM users
  WHERE is_archived = ?
  ORDER BY num_users ASC
  `;

  try {
    const [rows] = await pool.promise().query(sql, [archived]);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching archived users:", error);
    res.status(500).send(error);
  }
});



// Display data on AppDetailsForm_pg1 
router.get("/users/page1/:pwd_id", async (req, res) => {
  try {
    const { pwd_id } = req.params;
    const query = `
    SELECT 
      types_of_disability, 
      full_name, 
      education, 
      pwd_id, 
      address, 
      birthdate, 
      date_issued, 
      sex, 
      blood_type, 
      email,
      parent_guardian, 
      contact_number, 
      remarks, 
      philhealth_no,
      annotation
    FROM users
    WHERE pwd_id = ?
   `;
    const [results] = await pool.promise().query(query, [pwd_id]);
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ error: error.message });
  }
});

// Display data on AppDetailsForm_pg2 /////////////////////
router.get("/users/page2/:pwd_id", async (req, res) => {
  try {
    const { pwd_id } = req.params;
    const query = `
      SELECT
        first_name,
        transfer_from,
        middle_name,
        disability_cause,
        surname,  
        care_of,
        assistive_device,
        education,
        employment_status,
        civil_status,
        member_since,
        barangay,
        occupation
      FROM users
      WHERE pwd_id = ?
    `;
    const [results] = await pool.promise().query(query, [pwd_id]);
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ error: error.message });
  }
});


const getFilename = (path = '') => path.split('/').pop();
// Display image metadata for AppDetailsForm_pg3 /////////////////////
router.get("/users/images/:pwd_id", async (req, res) => {
  try {
    const { pwd_id } = req.params;
    const query = `
      SELECT 
        1x1_img,
        votersreg_img,
        birthcert_img,
        brgycert_img,
        govissue_img_1,
        govissue_img_2,
        med_cert
      FROM users
      WHERE pwd_id = ?
    `;

    const [results] = await pool.promise().query(query, [pwd_id]);

    if (results.length > 0) {
      const baseUrl = `${req.protocol}://${req.get('host')}/api/documents`;

      const row = results[0];
      const mapped = {
        '1x1_img': row['1x1_img'] ? `${baseUrl}/1x1_img/${getFilename(row['1x1_img'])}` : '',
        'votersreg_img': row.votersreg_img ? `${baseUrl}/votersreg_img/${getFilename(row.votersreg_img)}` : '',
        'birthcert_img': row.birthcert_img ? `${baseUrl}/birthcert_img/${getFilename(row.birthcert_img)}` : '',
        'brgycert_img': row.brgycert_img ? `${baseUrl}/brgycert_img/${getFilename(row.brgycert_img)}` : '',
        'govissue_img_1': row.govissue_img_1 ? `${baseUrl}/govissue_img_1/${getFilename(row.govissue_img_1)}` : '',
        'govissue_img_2': row.govissue_img_2 ? `${baseUrl}/govissue_img_2/${getFilename(row.govissue_img_2)}` : '',
        'med_cert': row.med_cert ? `${baseUrl}/med_cert/${getFilename(row.med_cert)}` : ''
      };

      res.json(mapped);
    } else {
      res.status(404).json({ error: "Image metadata not found for this PWD ID" });
    }
  } catch (error) {
    console.error("Error fetching image metadata:", error);
    res.status(500).json({ error: error.message });
  }
});



// PUT endpoint to update user details (triggered from AppDetailsForm_pg1.vue)
router.put("/users/page1/:pwd_id", async (req, res) => {
  try {
    const { pwd_id } = req.params;
    // Destructure the expected fields from the request body.
    const {
      types_of_disability,
      full_name,
      education,
      address,
      birthdate,
      date_issued,
      sex,
      blood_type,
      email,
      parent_guardian,
      contact_number,
      remarks,
      philhealth_no,
      annotation
    } = req.body;
    
    const query = `
      UPDATE users
      SET
        types_of_disability = ?,
        full_name = ?,
        education = ?,
        address = ?,
        birthdate = ?,
        date_issued = ?,
        sex = ?,
        blood_type = ?,
        email = ?,
        parent_guardian = ?,
        contact_number = ?,
        remarks = ?,
        philhealth_no = ?,
        annotation = ?
      WHERE pwd_id = ?
    `;
    
    await pool.promise().query(query, [
      types_of_disability,
      full_name,
      education,
      address,
      birthdate,
      date_issued,
      sex,
      blood_type,
      email,
      parent_guardian,
      contact_number,
      remarks,
      philhealth_no,
      annotation,
      pwd_id
    ]);    
    
    // Optionally query the updated record
    const [updatedResults] = await pool.promise().query(
      "SELECT * FROM users WHERE pwd_id = ?",
      [pwd_id]
    );

    // Fetch the updated table and broadcast it to clients
    const [updatedTable] = await pool.promise().query(`
      SELECT num_users AS user_number, full_name, address, sex, pwd_id, status_ AS status, date_issued 
      FROM users 
      ORDER BY num_users ASC
    `);

    // Broadcast to all connected frontend clients
    broadcastToClients({ event: "update-active", data: updatedTable });
    
    res.json(updatedResults[0] || { message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user details:", error);
    res.status(500).json({ error: error.message });
  }
});

// PUT endpoint to update user details (triggered from AppDetailsForm_pg2.vue)
router.put("/users/page2/:pwd_id", async (req, res) => {
  try {
    const { pwd_id } = req.params;

    const {
      first_name,
      transfer_from,
      middle_name,
      disability_cause,
      surname,  
      care_of,
      assistive_device,
      education,
      employment_status,
      civil_status,
      member_since,
      barangay,
      occupation
    } = req.body;

    const query = `
      UPDATE users
      SET
        first_name = ?,
        transfer_from = ?,
        middle_name = ?,
        disability_cause = ?,
        surname = ?,  
        care_of = ?,
        assistive_device = ?,
        education = ?,
        employment_status = ?,
        civil_status = ?,
        member_since = ?,
        barangay = ?,
        occupation = ?
      WHERE pwd_id = ?
    `;

    await pool.promise().query(query, [
      first_name,
      transfer_from,
      middle_name,
      disability_cause,
      surname,  
      care_of,
      assistive_device,
      education,
      employment_status,
      civil_status,
      member_since,
      barangay,
      occupation,
      pwd_id
    ]);

    const [updatedResults] = await pool.promise().query(
      "SELECT * FROM users WHERE pwd_id = ?",
      [pwd_id]
    );

    const [updatedTable] = await pool.promise().query(`
      SELECT num_users AS user_number, full_name, address, sex, pwd_id, status_ AS status, date_issued
      FROM users 
      ORDER BY num_users ASC
    `);

    broadcastToClients({ event: "update-active", data: updatedTable });

    res.json(updatedResults[0] || { message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user details:", error.message);
    res.status(500).json({ error: error.message });
  }  
});


// Moved outside the route handler since it's not used here
function formatDateToMySQL(date) {
  if (!date) return null;
  return new Date(date).toISOString().split("T")[0];
}



// POST endpoint to insert a new user record (CREATE)
// ✅ This is the correct one — KEEP THIS ONLY!
router.post("/users", async (req, res) => {
  try {
    const {
      full_name, types_of_disability, address, birthdate, date_issued, sex, blood_type,
      transfer_from, care_of, first_name, middle_name, surname, barangay, member_since,
      education, disability_cause, pwd_id, status_, parent_guardian, contact_number,
      remarks, philhealth_no, assistive_device, occupation, med_cert
    } = req.body;

    const [result] = await pool.promise().query("SELECT MAX(num_users) AS maxNum FROM users");
    const nextNumUsers = (result[0].maxNum || 0) + 1;

    const query = `
      INSERT INTO users (
        num_users, full_name, types_of_disability, address, birthdate, date_issued, sex,
        blood_type, transfer_from, care_of, first_name, middle_name, surname, barangay,
        member_since, education, disability_cause, pwd_id, status_, parent_guardian,
        contact_number, remarks, philhealth_no, assistive_device, occupation, med_cert
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await pool.promise().query(query, [
      nextNumUsers, full_name, types_of_disability, address, birthdate, date_issued, sex,
      blood_type, transfer_from, care_of, first_name, middle_name, surname, barangay,
      member_since, education, disability_cause, pwd_id, status_, parent_guardian,
      contact_number, remarks, philhealth_no, assistive_device, occupation, med_cert
    ]);

    const [updatedResults] = await pool.promise().query(`
      SELECT num_users AS user_number, full_name, address, sex, pwd_id, status_ AS status, date_issued, is_archived
      FROM users 
      ORDER BY num_users ASC
    `);

    // 🔥 1. Broadcast updated users
    broadcastToClients({ event: "update-active", data: updatedResults });

    // 🔥 2. Fetch next ID again and broadcast it
    const [nextIdResult] = await pool.promise().query('SELECT MAX(num_users) AS maxNum FROM users');
    const nextId = (nextIdResult[0].maxNum || 0) + 1;

    broadcastToClients({
      event: 'next-id-update',
      data: { nextId }
    });

    // ✅ 3. Send success response
    res.status(201).json({
      message: "User added successfully",
      user_number: nextNumUsers,
      pwd_id
    });

  } catch (error) {
    console.error("Error inserting user:", error);
    res.status(500).json({ error: error.message });
  }
});


// GET next number on record navigator
router.get('/next-id', async (req, res) => {
  try {
    const [result] = await pool.promise().query('SELECT MAX(num_users) AS maxNum FROM users');
    const nextId = (result[0].maxNum || 0) + 1;
    res.json({ nextId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch next ID' });
  }
});


// GET all users
router.get("/users", async (req, res) => {
  try {
    const [users] = await pool.query(`
      SELECT 
        num_users AS user_number,
        pwd_id,
        full_name,
        types_of_disability,
        address,
        birthdate,
        date_issued,
        sex,
        blood_type,
        transfer_from,
        care_of,
        first_name,
        middle_name,
        surname,
        barangay,
        member_since,
        education,
        disability_cause,
        status,
        parent_guardian,
        contact_number,
        remarks,
        philhealth_no,
        assistive_device,
        occupation
      FROM users
    `);
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});


// Search endpoint for Dashboard, Report, Form, and Pending Applicants pages
// Search endpoint for Dashboard, Report, Form, Pending Applicants, and Archive pages
router.get("/search", async (req, res) => {
  const { page, query, pwd_id } = req.query;

  try {
    let sql = '';
    let params = [];
    console.log("Search Page:", page);
    console.log("Query:", query);

    if (page === 'dashboard') {
      sql = `
        SELECT full_name, pwd_id, sex, date_issued
        FROM users
        WHERE LOWER(full_name) LIKE LOWER(?)
          OR LOWER(pwd_id) LIKE LOWER(?)
          OR LOWER(sex) = LOWER(?)
          OR LOWER(status_) = LOWER(?)
          OR DATE_FORMAT(date_issued, '%b %d, %Y') LIKE LOWER(?)
      `;
      params = [`%${query}%`, `%${query}%`, query, query, `%${query}%`];

      const [results] = await pool.promise().query(sql, params);
      return res.json(results.length ? results : [{ noMatch: true }]);

    } else if (page === 'database') {
      sql = `
        SELECT num_users AS user_number, full_name, sex, pwd_id, status_ AS status, date_issued
        FROM users
        WHERE full_name LIKE ?
          OR sex = ?
          OR pwd_id LIKE ?
          OR status_ = ?
          OR DATE_FORMAT(date_issued, '%b %d, %Y') LIKE ?
        ORDER BY num_users ASC
      `;
      params = [`%${query}%`, query, `%${query}%`, query, `%${query}%`];

      const [results] = await pool.promise().query(sql, params);
      return res.json(results.length ? results : [{ noMatch: true }]);

    } else if (page === 'form' && pwd_id) {
      const [allUsers] = await pool.promise().query(`SELECT pwd_id FROM users ORDER BY num_users ASC`);
      const index = allUsers.findIndex(user => user.pwd_id.toString() === pwd_id);

      if (index === -1) {
        return res.status(404).json({ message: "Record not found" });
      }

      const [recordResult] = await pool.promise().query(`
        SELECT 
          num_users AS user_number,
          pwd_id,
          full_name,
          types_of_disability,
          address,
          birthdate,
          date_issued,
          sex,
          blood_type,
          transfer_from,
          care_of,
          first_name,
          middle_name,
          surname,
          barangay,
          member_since,
          education,
          disability_cause,
          status_ AS status,
          parent_guardian,
          contact_number,
          remarks,
          philhealth_no,
          assistive_device,
          occupation
        FROM users
        WHERE pwd_id = ?
        LIMIT 1
      `, [pwd_id]);

      return res.json({
        record: recordResult[0],
        index,
        total: allUsers.length
      });

    } else if (page === 'pending') {
      sql = `
        SELECT full_name, email, application_status, submitted_at, id, is_renewal
        FROM pending_applications
        WHERE LOWER(full_name) LIKE LOWER(?)
          OR LOWER(email) LIKE LOWER(?)
          OR LOWER(application_status) = LOWER(?)
          OR DATE_FORMAT(submitted_at, '%b %d, %Y') LIKE LOWER(?)
      `;    
      params = [`%${query}%`, `%${query}%`, query, `%${query}%`];

      const [results] = await pool.promise().query(sql, params);
      return res.json(results.length ? results : [{ noMatch: true }]);

    } else if (page === 'archive') {
      sql = `
        SELECT 
          num_users AS user_number,
          full_name,
          sex,
          pwd_id,
          types_of_disability,
          archived_at
        FROM users
        WHERE is_archived = 1
          AND (
            LOWER(full_name) LIKE CONCAT('%', LOWER(?), '%')
            OR sex = ?  -- Exact match for male/female
            OR LOWER(types_of_disability) LIKE CONCAT('%', LOWER(?), '%')
            OR DATE_FORMAT(archived_at, '%M') LIKE ?  -- Month name (January, February...)
            OR DATE_FORMAT(archived_at, '%b') LIKE ?  -- Short month name (Jan, Feb...)
            OR DATE_FORMAT(archived_at, '%d') LIKE ?  -- Day of month (01-31)
            OR DATE_FORMAT(archived_at, '%Y') LIKE ?  -- Year (2023, 2024...)
            OR DATE_FORMAT(archived_at, '%m') LIKE ?  -- Month number (01-12)
          )
        ORDER BY archived_at DESC
      `;
      params = [
        query,         // for full_name
        query,         // for exact sex match
        query,         // for types_of_disability
        query + '%',   // for full month name
        query + '%',   // for short month name
        query + '%',   // for day
        query + '%',   // for year
        query + '%'    // for month number
      ];
    
      const [results] = await pool.promise().query(sql, params);
    
      // ✅ This is correct:
      return res.json(results.length ? results : [{ noMatch: true }]);
    }
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/users/archive", async (req, res) => {
  try {
    const [archivedUsers] = await pool.promise().query(`
      SELECT num_users, full_name, address, sex, types_of_disability, archived_at, pwd_id
      FROM users
      WHERE is_archived = 1
      ORDER BY num_users ASC
    `);

    res.json(archivedUsers);
  } catch (err) {
    res.status(500).send(err);
  }
});


// Get record by index for navigation (Create.vue)
// GET record by index only among non-archived users
router.get("/form-record", async (req, res) => {
  const { index } = req.query;

  if (!index || isNaN(index)) {
    return res.status(400).json({ message: "Index is required and must be a number" });
  }

  try {
    // ✅ Only get non-archived users
    const [activeUsers] = await pool.promise().query(`
      SELECT pwd_id FROM users
      WHERE is_archived = 0
      ORDER BY num_users ASC
    `);

    const recordIndex = parseInt(index);
    if (recordIndex < 0 || recordIndex >= activeUsers.length) {
      return res.status(404).json({ message: "Index out of bounds" });
    }

    const pwd_id = activeUsers[recordIndex].pwd_id;

    const [recordResult] = await pool.promise().query(`
      SELECT 
        num_users AS user_number,
        pwd_id,
        full_name,
        types_of_disability,
        address,
        birthdate,
        date_issued,
        sex,
        blood_type,
        transfer_from,
        care_of,
        first_name,
        middle_name,
        surname,
        barangay,
        member_since,
        education,
        disability_cause,
        status_ AS status,
        parent_guardian,
        contact_number,
        remarks,
        philhealth_no,
        assistive_device,
        occupation,
        med_cert
      FROM users
      WHERE pwd_id = ?
      LIMIT 1
    `, [pwd_id]);

    return res.json({
      record: recordResult[0],
      index: recordIndex,
      total: activeUsers.length // ✅ correct active total
    });

  } catch (err) {
    console.error("Error fetching record by index:", err);
    res.status(500).json({ message: "Server error" });
  }
});



// Generate a unique pwd_id
router.get("/generate-pwd-id", async (req, res) => {
  const generatePwdId = () => {
    const first = Math.floor(100 + Math.random() * 900);   // 3-digit
    const second = Math.floor(1000 + Math.random() * 9000); // 4-digit
    return `${first}-${second}`;
  };

  try {
    let pwdId;
    let isUnique = false;

    // Keep trying until a unique pwd_id is found
    while (!isUnique) {
      pwdId = generatePwdId();

      const [rows] = await pool.promise().query(
        "SELECT pwd_id FROM users WHERE pwd_id = ? LIMIT 1",
        [pwdId]
      );

      if (rows.length === 0) {
        isUnique = true;
      }
    }

    res.json({ pwd_id: pwdId });
  } catch (error) {
    console.error("Error generating pwd_id:", error);
    res.status(500).json({ error: "Failed to generate pwd_id" });
  }
});

//Deletes newly created document/record of pwd_id
router.delete("/users/:pwd_id", async (req, res) => {
  const { pwd_id } = req.params;

  try {
    const [result] = await pool.promise().query(
      "DELETE FROM users WHERE pwd_id = ?", 
      [pwd_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.status(200).json({ message: "Record deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Failed to delete record" });
  }
});


  // ✅ Route to verify PWD IDs existence before renewing
  router.get('/check/:pwd_id', async (req, res) => {
    const { pwd_id } = req.params;
  
    try {
      const [rows] = await pool.promise().query(
        'SELECT * FROM users WHERE pwd_id = ?',
        [pwd_id]
      );
  
      if (rows.length > 0) {
        res.json({ exists: true, data: rows[0] });
      } else {
        res.json({ exists: false });
      }
    } catch (err) {
      console.error('Error checking PWD ID:', err);
      res.status(500).json({ error: 'Database error' });
    }
  });
  

// Approve applicant endpoint
// This endpoint is used to approve an applicant and move them from pending_applications to users
router.post('/pending/:id/approve', approveApplicant);


export default router;
