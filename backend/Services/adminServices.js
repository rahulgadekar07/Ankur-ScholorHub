const bcrypt = require('bcryptjs'); // Import bcrypt library for password hashing
const db = require("../Config/database");
const jwt = require('jsonwebtoken');
// Service function for admin signup
async function adminSignup(adminname, email, password) {
  try {
    // Check if the email already exists in the database
    const [existingAdmins] = await db
      .promise()
      .query("SELECT * FROM adminlogin WHERE email = ?", [email]);
      console.log("The existing emials:- ",existingAdmins.length)
    if (existingAdmins.length > 0) {
      throw new Error("Email already exists");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new admin into the database
    const sql = "INSERT INTO adminlogin (adminname, email, password) VALUES (?, ?, ?)";
    await db.promise().query(sql, [adminname, email, hashedPassword]);

    // No need to return anything as we're not handling any response
  } catch (error) {
    console.error('Error creating admin:', error);
    throw error; // Rethrow the error to be handled by the caller
  }
}

// Service function for admin login
async function adminLogin(email, password) {
  try {
    // Query the database to find the admin by email
    const [admin] = await db
      .promise()
      .query("SELECT * FROM adminlogin WHERE email = ?", [email]);
    if (!admin || admin.length === 0) {
      throw new Error('Admin not found');
    }
    return admin[0];
    // Compare the provided password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(password, admin[0].password);
    
    if (!passwordMatch) {
      throw new Error('Incorrect password');
    }

    // Generate JWT token
    const token = jwt.sign(
      { adminId: admin[0].id, adminEmail: admin[0].email },
      'your-secret-key', // Replace with your own secret key
      { expiresIn: '1h' }
    );

    return token;
  } catch (error) {
    throw error; // Rethrow the error to be handled by the caller
  }
}

module.exports = {
  adminSignup,
  adminLogin
};