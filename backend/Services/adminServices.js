//adminServices.js (path: backend\Services\adminServices.js)

const {
  checkApplicationStatus,
  deleteApplication,
} = require("./scholorshipServices");

const bcrypt = require("bcryptjs"); // Import bcrypt library for password hashing
const db = require("../Config/database");
const jwt = require("jsonwebtoken");
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
    const sql =
      "INSERT INTO adminlogin (adminname, email, password) VALUES (?, ?, ?)";
    await db.promise().query(sql, [adminname, email, hashedPassword]);

    // No need to return anything as we're not handling any response
  } catch (error) {
    console.error("Error creating admin:", error);
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
      throw new Error("Admin not found");
    }
    return admin[0];
    // Compare the provided password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(password, admin[0].password);

    if (!passwordMatch) {
      throw new Error("Incorrect password");
    }

    // Generate JWT token
    const token = jwt.sign(
      { adminId: admin[0].id, adminEmail: admin[0].email },
      "your-secret-key", // Replace with your own secret key
      { expiresIn: "1h" }
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
    console.error("Error fetching users:", error);
    throw error; // Rethrow the error to be handled by the caller
  }
}

// Service function to toggle block status of a user
const toggleBlockUser = async (userId, shouldBlock) => {
  try {
    console.log(`${shouldBlock ? 'Blocking' : 'Unblocking'} user in users table...`);
    let result = await db.promise().query("UPDATE users SET blocked = ? WHERE id = ?", [shouldBlock, userId]);
    console.log('User block/unblock result:', result);

    return { message: shouldBlock ? 'User blocked successfully' : 'User unblocked successfully' };
  } catch (error) {
    console.error('Error in toggleBlockUser service:', error);
    throw new Error('Failed to block/unblock user');
  }
};

const getAllApplications = async () => {
  try {
    // Query the database to fetch all applications
    const [applications] = await db
      .promise()
      .query("SELECT * FROM application_status");
    return applications;
  } catch (error) {
    console.error("Error fetching all applications:", error);
    throw new Error("Internal server error");
  }
};

const approveApplication = async (applicationId, status, replyMessage) => {
  try {
    console.log(`Approving application with ID: ${applicationId}`);
    
    // Update the application status and reply message in the database
    const sql = "UPDATE application_status SET status = ?, replyMessage = ? WHERE id = ?";
    const result = await db.promise().query(sql, [status, replyMessage, applicationId]);
    
    if (result[0].affectedRows === 0) {
      console.log(`No application found with ID: ${applicationId}`);
      throw new Error(`No application found with ID: ${applicationId}`);
    }
    
    // Fetch the email of the user associated with the application
    const sql2 = "SELECT email FROM application_status WHERE id = ?";
    const [res] = await db.promise().query(sql2, [applicationId]);
    
    if (res.length === 0) {
      console.log(`No email found for application with ID: ${applicationId}`);
      throw new Error(`No email found for application with ID: ${applicationId}`);
    }
    
    const useremail = res[0].email;
    console.log(`Email found: ${useremail}`);
    
    // Send approval email to the user
    const text = "Your Application is Approved..! Kindly wait for further Updates..";
    try {
      const emailSent = await sendEmail(useremail, "Scholorship Application Approved", text);
      if (!emailSent) {
        console.log("Failed to send email");
        throw new Error("Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send email");
    }
    
    // Return success message
    return { message: "Application approved successfully" };
  } catch (error) {
    // Handle any errors
    console.error("Error approving application:", error);
    throw error; // Rethrow the error to be handled by the caller
  }
};


const rejectApplication = async (applicationId, status, replyMessage) => {
  try {
    // Update the application status and reply message in the database

    const sql2 = "select email from application_status where id= ? ";
    const [res] = await db.promise().query(sql2, [applicationId]);

    const sql =
      "UPDATE application_status SET status = ?, replyMessage = ? WHERE id = ?";
    const result = await db
      .promise()
      .query(sql, [status, replyMessage, applicationId]);
    const useremail = res[0].email;
    if (result && res) {
      const text =
        "Your Application is Rejected..! Kindly Contact to Office for further Enquiries..\n Reason:- " +
        replyMessage;
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
    return { message: "Application rejected successfully" };
  } catch (error) {
    // Handle any errors
    console.error("Error rejecting application:", error);
    throw error; // Rethrow the error to be handled by the caller
  }
};

// Service function to get all donors
const getAllDonors = async () => {
  try {
    // Query to fetch all donors from the database
    const donors = await db.promise().query("SELECT * FROM donations");

    return donors;
  } catch (error) {
    throw new Error("Error fetching donors");
  }
};

const getAllFeedbacks = async () => {
  try {
    const [feedbacks] = await db.promise().query("SELECT * FROM feedback");
    return feedbacks;
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    throw new Error("Error fetching feedbacks");
  }
};

const replyToFeedback = async (feedbackId, message) => {
  try {
    // Fetch the feedback details including email and subject
    const [feedback] = await db.promise().query("SELECT email, subject FROM feedback WHERE id = ?", [feedbackId]);
    const userEmail = feedback[0].email;
    const userSubject = feedback[0].subject;

    // Update the feedback with the reply message
    const sql = "UPDATE feedback SET replyMessage = ? WHERE id = ?";
    await db.promise().query(sql, [message, feedbackId]);

    // Format the email body
    const emailBody = `
      <p>Dear User,</p>
      <p>Thank you for your feedback on the subject: <strong>${userSubject}</strong></p>
      <p>Our response to your feedback is as follows:</p>
      <p>${message}</p>
      <p>Best regards,</p>
      <p>Ankur Vidyarthi Foundation</p>
    `;

    // Send the reply message to the user's email
    const emailSent = await sendEmail(userEmail, `Reply to your feedback on "${userSubject}"`, emailBody);
    if (!emailSent) {
      throw new Error("Failed to send email");
    }
  } catch (error) {
    console.error("Error replying to feedback:", error);
    throw new Error("Error replying to feedback");
  }
};

// Function to get the NewsStrip visibility status
async function getNewsStripVisibility() {
  return new Promise((resolve, reject) => {
    const query = 'SELECT isVisible FROM NewsStrip WHERE id = 1';
    db.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results[0].isVisible);
      }
    });
  });
}

// Function to update the NewsStrip visibility status
async function setNewsStripVisibility(isVisible) {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE NewsStrip SET isVisible = ? WHERE id = 1';
    db.query(query, [isVisible], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}
module.exports = {
  adminSignup,
  adminLogin,
  getAllUsers,
  toggleBlockUser,
  getAllApplications,
  getAllDonors,
  approveApplication,
  rejectApplication,
  getAllFeedbacks,
  replyToFeedback,
  getNewsStripVisibility,
  setNewsStripVisibility
};
