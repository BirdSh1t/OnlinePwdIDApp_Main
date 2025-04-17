import express from "express";
import { pool } from '../config/database.js';
import { broadcastToClients } from '../websocketServer.js';

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
    const query = `
      SELECT 
      num_users AS user_number, full_name, address, sex, 
      pwd_id, status_ AS status, date_issued, 
      types_of_disability, birthdate, blood_type, transfer_from, care_of, 
      first_name, middle_name, surname, barangay, member_since,
      education, disability_cause, parent_guardian, contact_number,
      remarks, philhealth_no, assistive_device, occupation, annotation,  1x1_img,
      votersreg_img, birthcert_img, brgycert_img, govissue_img_1, govissue_img_2 
      FROM users
      ORDER BY num_users ASC

    `;
    const [results] = await pool.promise().query(query);
    res.json(results);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: error.message });
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
        govissue_img_2
      FROM users
      WHERE pwd_id = ?
    `;

    const [results] = await pool.promise().query(query, [pwd_id]);

    if (results.length > 0) {
      res.json(results[0]);
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
      SELECT num_users AS user_number, full_name, sex, pwd_id, status_ AS status, date_issued 
      FROM users 
      ORDER BY num_users ASC
    `);

    // Broadcast to all connected frontend clients
    broadcastToClients(updatedTable);
    
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
      SELECT num_users AS user_number, full_name, sex, pwd_id, status_ AS status, date_issued 
      FROM users 
      ORDER BY num_users ASC
    `);

    broadcastToClients(updatedTable);

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
router.post("/users", async (req, res) => {
  try {
    // Destructure all required fields from the request body.
    const {
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
      pwd_id,
      status_,
      parent_guardian,
      contact_number,
      remarks,
      philhealth_no,
      assistive_device,
      occupation,
    } = req.body;


    const [result] = await pool.promise().query("SELECT MAX(num_users) AS maxNum FROM users");
    const nextNumUsers = (result[0].maxNum || 0) + 1;

    // 🧱 Step 2: Insert new user including num_users
    const query = `
      INSERT INTO users (
        num_users,
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
        pwd_id,
        status_,
        parent_guardian,
        contact_number,
        remarks,
        philhealth_no,
        assistive_device,
        occupation
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await pool.promise().query(query, [
      nextNumUsers,
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
      pwd_id,
      status_,
      parent_guardian,
      contact_number,
      remarks,
      philhealth_no,
      assistive_device,
      occupation,
    ]);

    // 🔁 Step 3: Optionally broadcast updated table
    const [updatedResults] = await pool.promise().query(`
      SELECT num_users AS user_number, full_name, sex, pwd_id, status_ AS status, date_issued 
      FROM users 
      ORDER BY num_users ASC
    `);

    broadcastToClients(updatedResults);

    res.status(201).json({
      message: "User added successfully",
      user_number: nextNumUsers, // <-- your assigned num_users
      pwd_id: pwd_id
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
router.get('/users', async (req, res) => {
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


// Search endpoint for Dashboard, Report, and Create (Form) pages
router.get("/search", async (req, res) => {
  const { page, query, pwd_id } = req.query;

  try {
    let sql = '';
    let params = [];

    if (page === 'dashboard') {
      sql = `
        SELECT full_name, address, sex, date_issued
        FROM users
        WHERE LOWER(full_name) LIKE LOWER(?)
          OR LOWER(address) LIKE LOWER(?)
          OR LOWER(sex) = LOWER(?)
          OR LOWER(status_) = LOWER(?)
          OR DATE_FORMAT(date_issued, '%b %d, %Y') LIKE LOWER(?)
      `;
      params = [`%${query}%`, `%${query}%`, query, query, `%${query}%`];

      const [results] = await pool.promise().query(sql, params);
      return res.json(results.length ? results : [{ noMatch: true }]);

    } else if (page === 'report') {
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
      // Get all pwd_ids sorted by num_users
      const [allUsers] = await pool.promise().query(`SELECT pwd_id FROM users ORDER BY num_users ASC`);
      const index = allUsers.findIndex(user => user.pwd_id === pwd_id);

      if (index === -1) {
        return res.status(404).json({ message: "Record not found" });
      }

      // Get the full record of that user
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

    } else {
      return res.status(400).json({ message: "Invalid page type" });
    }
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// Get record by index for navigation (Create.vue)
router.get("/form-record", async (req, res) => {
  const { index } = req.query;

  if (!index || isNaN(index)) {
    return res.status(400).json({ message: "Index is required and must be a number" });
  }

  try {
    // Get the full list of pwd_ids sorted by num_users
    const [allUsers] = await pool.promise().query(`SELECT pwd_id FROM users ORDER BY num_users ASC`);

    const recordIndex = parseInt(index);
    if (recordIndex < 0 || recordIndex >= allUsers.length) {
      return res.status(404).json({ message: "Index out of bounds" });
    }

    const pwd_id = allUsers[recordIndex].pwd_id;

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
      index: recordIndex,
      total: allUsers.length
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
    const [result] = await db.query("DELETE FROM users WHERE pwd_id = ?", [pwd_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.status(200).json({ message: "Record deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Failed to delete record" });
  }
});





//websocket related endpoints
// New POST endpoint to insert a user and broadcast updates
router.post("/users", async (req, res) => {
  try {
    const { full_name, sex, pwd_id, status_, date_issued } = req.body;
    const query = `
      INSERT INTO users (full_name, sex, pwd_id, status_, date_issued)
      VALUES (?, ?, ?, ?, ?)
    `;
    await pool.promise().query(query, [full_name, sex, pwd_id, status_, date_issued]);

    // After insertion, fetch updated data
    const [results] = await pool.promise().query(`
      SELECT num_users AS user_number, full_name, sex, pwd_id, status_ AS status, date_issued 
      FROM users 
      ORDER BY num_users ASC
    `);
    
    // Broadcast the updated results to all WebSocket clients
    broadcastToClients(results);

    res.status(201).json({ message: "User added successfully" });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;




