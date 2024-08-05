const db = require("../Config/database");

async function savePersonalDetails({
  userId,
  fullname,
  email,
  mobile,
  dob,
  gender,
  aadharCard,
}) {
  try {
    const sql = `
      INSERT INTO personal_details (userId, fullname, email, mobile, dob, gender, aadharCard)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [userId, fullname, email, mobile, dob, gender, aadharCard];
    await db.promise().query(sql, values);
  } catch (error) {
    console.error("Error saving personal details:", error);
    throw error;
  }
}
// Function to save address details into the database
async function saveAddressDetails({
  userId,
  permanent_address,
  current_address,
}) {
  try {
    // Prepare SQL query to insert address details
    const sql = `
      INSERT INTO address_details (user_id, permanent_address, permanent_state, permanent_district, permanent_taluka, permanent_city, permanent_pincode, current_address, current_state, current_district, current_taluka, current_city, current_pincode)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      userId,
      permanent_address.address,
      permanent_address.state,
      permanent_address.district,
      permanent_address.taluka,
      permanent_address.city,
      permanent_address.pincode,
      current_address.address,
      current_address.state,
      current_address.district,
      current_address.taluka,
      current_address.city,
      current_address.pincode,
    ];

    // Execute the SQL query
    await db.promise().query(sql, values);
  } catch (error) {
    console.error("Error saving address details:", error);
    throw error;
  }
}
// Function to save income details into the database

async function saveIncomeDetails({
  userId,
  parentName,
  parentMobile,
  jobType,
  jobDescription,
  annualIncome,
  incomeCertificate,
}) {
  try {
    const sql = `
      INSERT INTO incomedetails (userId, parentName, parentMobile, jobType, jobDescription, annualIncome, incomeCertificate)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      userId,
      parentName,
      parentMobile,
      jobType,
      jobDescription,
      annualIncome,
      incomeCertificate,
    ];
    await db.promise().query(sql, values);
  } catch (error) {
    console.error("Error saving income details:", error);
    throw error;
  }
}

// Function to save education details into the database
async function saveEducationDetails({
  userId,
  qualification,
  courseName,
  institute,
  currentYear,
  idCard,
  email,
}) {
  try {
    // Prepare SQL query to insert education details
    const sql = `
      INSERT INTO education_details (userId,qualification, course_name, institute, current_year, id_card_path)
      VALUES (?, ?, ?, ?, ?,?)
    `;
    const values = [
      userId,
      qualification,
      courseName,
      institute,
      currentYear,
      idCard,
    ];

    // Execute the SQL query
    const q1 = await db.promise().query(sql, values);
    if (q1) {
      // Insert record into application_status table
      const statusSql = `
      INSERT INTO application_status (userId, status,email)
      VALUES (?, ?,?)
    `;
      const statusValues = [userId, "pending", email]; // Set initial status as 'pending' and replyMessage as null
      const result = await db.promise().query(statusSql, statusValues);
      return result;
    }
  } catch (error) {
    console.error("Error saving education details:", error);
    throw error;
  }
}

async function checkPersonalDetails(userId) {
  try {
    const sql = `
      SELECT * FROM personal_details WHERE userId = ?
    `;
    const [rows] = await db.promise().query(sql, [userId]);
    return rows.length > 0; // Return true if personal details exist; otherwise, false
  } catch (error) {
    console.error("Error checking personal details:", error);
    throw error;
  }
}
async function checkIncomeDetails(userId) {
  try {
    const sql = `
      SELECT * FROM incomedetails WHERE userId = ?
    `;
    const [rows] = await db.promise().query(sql, [userId]);
    return rows.length > 0; // Return true if personal details exist; otherwise, false
  } catch (error) {
    console.error("Error checking Income details:", error);
    throw error;
  }
}
async function checkAddressDetails(userId) {
  try {
    const sql = `
      SELECT * FROM address_details WHERE user_id = ?
    `;
    const [rows] = await db.promise().query(sql, [userId]);
    return rows.length > 0; // Return true if personal details exist; otherwise, false
  } catch (error) {
    console.error("Error checking Income details:", error);
    throw error;
  }
}
async function checkEducationDetails(userId) {
  try {
    const sql = `
      SELECT * FROM education_details WHERE userId = ?
    `;
    const [rows] = await db.promise().query(sql, [userId]);
    return rows.length > 0; // Return true if personal details exist; otherwise, false
  } catch (error) {
    console.error("Error checking Education details:", error);
    throw error;
  }
}

async function checkApplicationStatus(userId) {
  try {
    const sql = `
      SELECT * FROM application_status WHERE userId = ? 
    `;
    const [rows] = await db.promise().query(sql, [userId]);
    if (rows.length > 0) {
      return { exists: true, data: rows[0] }; // Return an object indicating existence and data
    } else {
      return { exists: false }; // Return an object indicating non-existence
    }
  } catch (error) {
    console.error("Error checking application status:", error);
    throw error;
  }
}

// Functions to View Application Form

async function getAllPersonalDetails(userId) {
  try {
    const sql = `
      SELECT * FROM personal_details WHERE userId = ?
    `;
    const [rows] = await db.promise().query(sql, [userId]);
    return rows; // Return all personal details for the given userId
  } catch (error) {
    console.error("Error getting personal details:", error);
    throw error;
  }
}

async function getAllIncomeDetails(userId) {
  try {
    const sql = `
      SELECT * FROM incomedetails WHERE userId = ?
    `;
    const [rows] = await db.promise().query(sql, [userId]);
    return rows; // Return all income details for the given userId
  } catch (error) {
    console.error("Error getting income details:", error);
    throw error;
  }
}

async function getAllAddressDetails(userId) {
  try {
    const sql = `
      SELECT * FROM address_details WHERE user_id = ?
    `;
    const [rows] = await db.promise().query(sql, [userId]);
    return rows; // Return all address details for the given userId
  } catch (error) {
    console.error("Error getting address details:", error);
    throw error;
  }
}

async function getAllEducationDetails(userId) {
  try {
    const sql = `
      SELECT * FROM education_details WHERE userId = ?
    `;
    const [rows] = await db.promise().query(sql, [userId]);
    return rows; // Return all education details for the given userId
  } catch (error) {
    console.error("Error getting education details:", error);
    throw error;
  }
}

// Function to delete application data for a user

async function deleteApplication(userId) {
  try {
    // Delete application status
    const deleteStatusSql = `
      DELETE FROM application_status WHERE userId = ?
    `;
    await db.promise().query(deleteStatusSql, [userId]);

    // Delete personal details
    const deletePersonalDetailsSql = `
      DELETE FROM personal_details WHERE userId = ?
    `;
    await db.promise().query(deletePersonalDetailsSql, [userId]);

    // Delete income details
    const deleteIncomeDetailsSql = `
      DELETE FROM incomedetails WHERE userId = ?
    `;
    await db.promise().query(deleteIncomeDetailsSql, [userId]);

    // Delete education details
    const deleteEducationDetailsSql = `
      DELETE FROM education_details WHERE userId = ?
    `;
    await db.promise().query(deleteEducationDetailsSql, [userId]);

    // Delete address details
    const deleteAddressDetailsSql = `
      DELETE FROM address_details WHERE user_id = ?
    `;
    await db.promise().query(deleteAddressDetailsSql, [userId]);

    // Delete address details
    const deleteQuizResult = ` DELETE FROM quiz_results WHERE userId = ?`;
    await db.promise().query(deleteQuizResult, [userId]);
  } catch (error) {
    console.error("Error deleting application data:", error);
    throw error;
  }
}

async function getAllDocuments(userId) {
  try {
    const personalDetailsSql = `
      SELECT aadharCard FROM personal_details WHERE userId = ?
    `;
    const [personalDetailsRows] = await db
      .promise()
      .query(personalDetailsSql, [userId]);

    const incomeDetailsSql = `
      SELECT incomeCertificate FROM incomedetails WHERE userId = ?
    `;
    const [incomeDetailsRows] = await db
      .promise()
      .query(incomeDetailsSql, [userId]);

    const educationDetailsSql = `
      SELECT id_card_path FROM education_details WHERE userId = ?
    `;
    const [educationDetailsRows] = await db
      .promise()
      .query(educationDetailsSql, [userId]);

    const documents = {
      personalDetails: personalDetailsRows
        .map((row) => row.aadharCard)
        .filter(Boolean),
      incomeDetails: incomeDetailsRows
        .map((row) => row.incomeCertificate)
        .filter(Boolean),

      educationDetails: educationDetailsRows
        .map((row) => row.id_card_path)
        .filter(Boolean),
    };
    return documents;
  } catch (error) {
    console.error("Error fetching documents:", error);
    throw error;
  }
}

module.exports = {
  savePersonalDetails,
  saveIncomeDetails,
  saveEducationDetails,
  saveAddressDetails,

  checkPersonalDetails,
  checkIncomeDetails,
  checkAddressDetails,
  checkEducationDetails,

  deleteApplication,
  checkApplicationStatus,

  getAllPersonalDetails,
  getAllIncomeDetails,
  getAllAddressDetails,
  getAllEducationDetails,

  getAllDocuments,
};
