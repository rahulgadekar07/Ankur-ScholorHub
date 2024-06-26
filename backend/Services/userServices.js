// userService.js

// Import necessary modules
const bcrypt = require("bcryptjs");
const db = require("../Config/database");

// Service function for creating a new user
async function createUser(name, email, password) {
  try {
    // Check if the email already exists in the database
    const [existingUsers] = await db
      .promise()
      .query("SELECT * FROM users WHERE email = ?", [email]);
    if (existingUsers.length > 0) {
      throw new Error("Email already exists");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    const [result] = await db
      .promise()
      .query(sql, [name, email, hashedPassword]);


    // Return the result or handle it as needed
    return result;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error; // Rethrow the error to be handled by the caller
  }
}

// Service function for finding a user by email
async function findUserByEmail(email) {
  try {
    // Query the database to find the user by email
    const [users] = await db
      .promise()
      .query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) {
      return null;
    }
    // Return the user object
    return users[0];
  } catch (error) {
    console.error("Error finding user by email:", error);
    throw error; // Rethrow the error to be handled by the caller
  }
}

// Service function for getting user data by ID
async function getUserById(userId) {
  function formatIdWithLeadingZeros(userId) {
    return userId.toString().padStart(4, "0");
  }
  
  try {
    // Query the database to find the user by ID
    const formattedUserId = formatIdWithLeadingZeros(userId);
    const [users] = await db
      .promise()
      .query("SELECT * FROM users WHERE id = ?", [formattedUserId]);
      
    if (users.length === 0) {
      return null;
    }
    // Return the user object
    return users[0];
  } catch (error) {
    console.error("Error finding user by ID:", error);
    throw error; // Rethrow the error to be handled by the caller
  }
}

// Service function for updating user profile picture path
async function updateProfilePic(userId, profilePicPath) {
  try {
    // Update the user record in the database with the new profile picture path
    const sql = "UPDATE users SET profpic = ? WHERE id = ?";
    const [result] = await db.promise().query(sql, [profilePicPath, userId]);

    // Return the result or handle it as needed
    return result;
  } catch (error) {
    console.error("Error updating profile picture:", error);
    throw error; // Rethrow the error to be handled by the caller
  }
}
// Service function for submitting feedback
async function submitFeedback(userId, name, email, subject, message) {
  try {
    // Assuming you have a table called 'feedback'
    const sql = "INSERT INTO feedback (userId, name, email, subject, message) VALUES (?, ?, ?, ?, ?)";
    const [result] = await db
      .promise()
      .query(sql, [userId, name, email, subject, message]);

    // Return the result or handle it as needed
    return result;
  } catch (error) {
    console.error("Error submitting feedback:", error);
    throw error; // Rethrow the error to be handled by the caller
  }
}


// Export service functions
module.exports = {
  createUser,
  findUserByEmail,
  submitFeedback,
  getUserById,
  updateProfilePic, // Export the updateProfilePic function
};
