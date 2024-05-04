const adminService = require('../Services/adminServices')
const bcrypt = require('bcryptjs');
const { sendEmail } = require('../Config/emailSender');

const jwt = require('jsonwebtoken');
// Controller function for admin signup
const adminSignup = async (req, res) => {
  try {
    // Extract admin details from the request body
    const { adminname, email, password } = req.body;
    // Call the admin service to handle the signup logic
    await adminService.adminSignup(adminname, email, password);
    // Return success response
    res.status(200).json({ message: 'Admin signed up successfully' });
  } catch (error) {
    if (error.message === "Email already exists") {
      res.status(400).json({ message: error.message }); // Bad request status for existing email
    } else {
      console.error('Error in admin signup:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};
// Controller function for admin login
const adminLogin = async (req, res) => {
  try {
    // Extract admin credentials from the request body
    const { email, password } = req.body;
    

    // Call the admin service to verify admin credentials
    const admin = await adminService.adminLogin(email, password);
    // If admin not found or password doesn't match, return error response
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token containing admin ID, name, and email
    const token = jwt.sign(
      { adminId: admin.adminId, adminName: admin.adminname, adminEmail: admin.email },
      'AnkurAdmin123',
      { expiresIn: '1h' }
    );

    // Return success response with JWT token
    res.status(200).json({ token });
  } catch (error) {
    console.error('Error in admin login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Controller function to fetch all users
const getAllUsers = async (req, res) => {
  try {
    // Call the admin service to fetch all users
    const users = await adminService.getAllUsers();

    // Return the users in the response
    res.status(200).json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
async function removeUser(req, res) {
  try {
    const userId = req.params.userId;
    const userEmail = req.query.email; // Accessing userEmail from query parameters

    let result = await adminService.removeUser(userId);
    if (result.message === 'User deleted successfully') {
      const text = "You have been Removed From Ankur Vidyarthi Foundation website By Admin....";
      try {
        // Assuming sendEmail is defined somewhere else or imported
        const emailSent = await sendEmail(userEmail, "Account Removed", text);
        if (emailSent) {
          res.status(200).send({ message: 'User deleted successfully' });
        } else {
          throw new Error('Failed to send email');
        }
      } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Failed to send email');
      }
    } else {
      res.status(200).send({ message: 'User deleted successfully' });
    }
  } catch (error) {
    console.error('Error in removing user controller:', error);
    res.status(500).send({ error: 'Failed to delete user' });
  }
}

const getAllApplications = async (req, res) => {
  try {
    const applications = await adminService.getAllApplications();
    res.json(applications);
  } catch (error) {
    console.error("Error fetching all applications:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const approveApplication = async (req, res) => {
  try {
    const { applicationId } = req.params; // Accessing applicationId from URL params
    // Assuming you want to update the application status and reply message
    const { status, replyMessage } = req.body;
    
    // Call the service function to update the application status
    await adminService.approveApplication(applicationId, status, replyMessage);
    
    res.status(200).json({ message: 'Application approved successfully' });
  } catch (error) {
    console.error('Error approving application:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const rejectApplication = async (req, res) => {
  try {
    const { selectedApplicationId } = req.params;
    const { status, replyMessage } = req.body;

    await adminService.rejectApplication(selectedApplicationId, status, replyMessage);

    res.status(200).json({ message: 'Application rejected successfully' });
  } catch (error) {
    console.error('Error rejecting application:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
module.exports = {
  adminLogin,
  adminSignup,
  getAllUsers,
  removeUser,
  getAllApplications,
  approveApplication,
  rejectApplication
}