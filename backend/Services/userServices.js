// userService.js

// Import necessary modules
const bcrypt = require('bcryptjs');
const db = require('../Config/database');

// Service function for creating a new user
async function createUser(name, email, password) {
  try {
    // Check if the email already exists in the database
    const [existingUsers] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      throw new Error('Email already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert the new user into the database
    const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    const [result] = await db.promise().query(sql, [name, email, hashedPassword]);
    
    console.log(result); // Log the result for debugging
    
    // Return the result or handle it as needed
    return result;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error; // Rethrow the error to be handled by the caller
  }
}

// Service function for finding a user by email
async function findUserByEmail(email) {
  try {
    // Query the database to find the user by email
    const [users] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
    console.log(users)
    if (users.length === 0) {
      return null;
    }
    // Return the user object
    return users[0];
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw error; // Rethrow the error to be handled by the caller
  }
}
// Service function for getting user data by ID
async function getUserById(userId) {
  try {
    // Query the database to find the user by ID
    const [users] = await db.promise().query('SELECT * FROM users WHERE id = ?', [userId]);
    if (users.length === 0) {
      return null;
    }
    // Return the user object
    return users[0];
  } catch (error) {
    console.error('Error finding user by ID:', error);
    throw error; // Rethrow the error to be handled by the caller
  }
}

// Export service functions
module.exports = {
  createUser,
  findUserByEmail,
  getUserById // Add this line to export the getUserById function
};