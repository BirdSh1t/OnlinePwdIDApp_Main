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
      SELECT number AS user_number, full_name, address, sex, pwd_id, status_ AS status, date_issued 
      FROM users 
      ORDER BY number ASC
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
        philhealth_no
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
      philhealth_no
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
        philhealth_no = ?
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
      pwd_id
    ]);
    
    // Optionally query the updated record
    const [updatedResults] = await pool.promise().query(
      "SELECT * FROM users WHERE pwd_id = ?",
      [pwd_id]
    );

    // Fetch the updated table and broadcast it to clients
    const [updatedTable] = await pool.promise().query(`
      SELECT number AS user_number, full_name, sex, pwd_id, status_ AS status, date_issued 
      FROM users 
      ORDER BY number ASC
    `);

    // Broadcast to all connected frontend clients
    broadcastToClients(updatedTable);
    
    res.json(updatedResults[0] || { message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user details:", error);
    res.status(500).json({ error: error.message });
  }
});

// Moved outside the route handler since it's not used here
function formatDateToMySQL(date) {
  if (!date) return null;
  return new Date(date).toISOString().split("T")[0];
}


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
        barangay
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
        barangay
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
        barangay = ?
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
        pwd_id,
    ]);

    // Optional: return the updated record
    const [updatedResults] = await pool.promise().query(
      "SELECT * FROM users WHERE pwd_id = ?",
      [pwd_id]
    );

    // 🔁 Broadcast the entire updated user table to all connected clients
    const [updatedTable] = await pool.promise().query(`
      SELECT number AS user_number, full_name, sex, pwd_id, status_ AS status, date_issued 
      FROM users 
      ORDER BY number ASC
    `);

    broadcastToClients(updatedTable);

    res.json(updatedResults[0] || { message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user details:", error.message);
    res.status(500).json({ error: error.message });
  }  
});







//Search endpoint for Dashboard and Report pages
router.get("/search", async (req, res) => {
  const { page, query } = req.query;

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
    } else if (page === 'report') {
      sql = `
        SELECT number AS user_number, full_name, sex, pwd_id, status_ AS status, date_issued
        FROM users
        WHERE full_name LIKE ?
          OR sex = ?
          OR pwd_id LIKE ?
          OR status_ = ?
          OR DATE_FORMAT(date_issued, '%b %d, %Y') LIKE ?
        ORDER BY number ASC
      `;
      params = [`%${query}%`, query, `%${query}%`, query, `%${query}%`];
    } else {
      return res.status(400).json({ message: "Invalid page type" });
    }

    console.log("SQL Query:", sql);
    console.log("Params:", params);

    const [results] = await pool.promise().query(sql, params);

    res.json(results.length ? results : [{ noMatch: true }]);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Server error" });
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
      SELECT number AS user_number, full_name, sex, pwd_id, status_ AS status, date_issued 
      FROM users 
      ORDER BY number ASC
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




