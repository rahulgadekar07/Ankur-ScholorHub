const { checkApplicationStatus, deleteApplication } = require('./scholorshipServices');

const bcrypt = require('bcryptjs'); // Import bcrypt library for password hashing
const db = require("../Config/database");
const jwt = require('jsonwebtoken');
const { sendEmail } = require("../Config/emailSender");

// Service function for admin signup
async function adminSignup(adminname, email, password) {
  try {
    // Check if the email already exists in the database
    const [existingAdmins] = await db
      .promise()
      .query("SELECT * FROM adminlogin WHERE email = ?", [email]);
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
// Service function to fetch all users
async function getAllUsers() {
  try {
    // Query the database to fetch all users
    const [users] = await db.promise().query("SELECT * FROM users");

    // Return the fetched users
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error; // Rethrow the error to be handled by the caller
  }
}


// Function to remove user from all tables
const removeUser = async (userId) => {
  try {
    // Remove user from the 'users' table
   

    // Remove user from other tables if needed
    
     let r1=await checkApplicationStatus(userId)
     if(r1.exists){
      await deleteApplication(userId)
     }
     let gg=await db.promise().query("DELETE FROM users WHERE id = ?", [userId]);
    // Return success message if user is deleted successfully
    return { message: 'User deleted successfully' };
  } catch (error) {
    throw new Error('Failed to delete user');
  }
};
const getAllApplications = async () => {
  try {
    // Query the database to fetch all applications
    const [applications] = await db.promise().query("SELECT * FROM application_status");
    return applications;
  } catch (error) {
    console.error("Error fetching all applications:", error);
    throw new Error("Internal server error");
  }
};


const approveApplication = async (applicationId, status, replyMessage) => {
  try {
    // Update the application status and reply message in the database
    const sql = "UPDATE application_status SET status = ?, replyMessage = ? WHERE id = ?";
    const result=await db.promise().query(sql, [status, replyMessage, applicationId]);
    const sql2= "select email from application_status where id= ? ";
    const [res]=await db.promise().query(sql2, [applicationId]);
    const useremail=res[0].email;
    if (result && res) {
      const text =
        "Your Application is Approved..! Kindly wait for further Updates..";
      try {
        const emailSent = await sendEmail(
          useremail,
          "Scholorship Application Approved",
          text
        );
        if (emailSent) {
        } else {
          res.status(500).send("Failed to send email");
        }
      } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).send("Failed to send email");
      }
    }
    // Return success message or any other data if needed
    return { message: 'Application approved successfully' };
  } catch (error) {
    // Handle any errors
    console.error('Error approving application:', error);
    throw error; // Rethrow the error to be handled by the caller
  }
};

const rejectApplication = async (applicationId, status, replyMessage) => {
  try {
    // Update the application status and reply message in the database
   
    const sql2= "select email from application_status where id= ? ";
    const [res]=await db.promise().query(sql2, [applicationId]);

    const sql = "UPDATE application_status SET status = ?, replyMessage = ? WHERE id = ?";
    const result =await db.promise().query(sql, [status, replyMessage, applicationId]);
    const useremail=res[0].email;
    if (result && res) {
      const text =
        "Your Application is Rejected..! Kindly Contact to Office for further Enquiries.."+replyMessage;
      try {
        const emailSent = await sendEmail(
          useremail,
          "Scholorship Application Rejected",
          text
        );
        if (emailSent) {
        } else {
          res.status(500).send("Failed to send email");
        }
      } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).send("Failed to send email");
      }
    }
    // Return success message or any other data if needed
    return { message: 'Application rejected successfully' };
  } catch (error) {
    // Handle any errors
    console.error('Error rejecting application:', error);
    throw error; // Rethrow the error to be handled by the caller
  }
};

// Service function to get all donors
const getAllDonors = async () => {
  try {
    // Query to fetch all donors from the database
    const donors = await db.promise().query('SELECT * FROM donations');

    return donors;
  } catch (error) {
    throw new Error('Error fetching donors');
  }
};
module.exports = {
  adminSignup,
  adminLogin,
  getAllUsers,
  removeUser,
  getAllApplications,
  getAllDonors,
  approveApplication,rejectApplication
};