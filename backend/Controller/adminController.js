//adminController.js (path: backend\Controller\adminController.js)

const adminService = require("../Services/adminServices");
const bcrypt = require("bcryptjs");
const { sendEmail } = require("../Config/emailSender");

const jwt = require("jsonwebtoken");
// Controller function for admin signup
const adminSignup = async (req, res) => {
  try {
    // Extract admin details from the request body
    const { adminname, email, password } = req.body;
    // Call the admin service to handle the signup logic
    await adminService.adminSignup(adminname, email, password);
    // Return success response
    res.status(200).json({ message: "Admin signed up successfully" });
  } catch (error) {
    if (error.message === "Email already exists") {
      res.status(400).json({ message: error.message }); // Bad request status for existing email
    } else {
      console.error("Error in admin signup:", error);
      res.status(500).json({ message: "Internal server error" });
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
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token containing admin ID, name, and email
    const token = jwt.sign(
      {
        adminId: admin.adminId,
        adminName: admin.adminname,
        adminEmail: admin.email,
      },
      "AnkurAdmin123",
      { expiresIn: "1h" }
    );

    // Return success response with JWT token
    res.status(200).json({ token });
  } catch (error) {
    console.error("Error in admin login:", error);
    res.status(500).json({ message: "Internal server error" });
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
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

async function toggleBlockUser(req, res) {
  try {
    const userId = req.params.userId; // Get userId from URL params
    const userEmail = req.query.email; // Get userEmail from query parameters
    const shouldBlock = req.query.block === "true"; // Determine if the user should be blocked

    // Call the service function to toggle block status
    let result = await adminService.toggleBlockUser(userId, shouldBlock);
    console.log("result-", result);
    const action = shouldBlock ? "blocked" : "unblocked";
    const text = `You have been ${action} from the Ankur Vidyarthi Foundation website by Admin....`;

    try {
      const emailSent = await sendEmail(
        userEmail,
        `Account ${action.charAt(0).toUpperCase() + action.slice(1)}`,
        text
      );
      if (emailSent) {
        res.status(200).send({ message: `User ${action} successfully` });
      } else {
        throw new Error("Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).send("Failed to send email");
    }
  } catch (error) {
    console.error("Error in block/unblock user controller:", error);
    res.status(500).send({ error: "Failed to block/unblock user" });
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

    res.status(200).json({ message: "Application approved successfully" });
  } catch (error) {
    console.error("Error approving application:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const rejectApplication = async (req, res) => {
  try {
    const { selectedApplicationId } = req.params;
    const { status, replyMessage } = req.body;

    await adminService.rejectApplication(
      selectedApplicationId,
      status,
      replyMessage
    );

    res.status(200).json({ message: "Application rejected successfully" });
  } catch (error) {
    console.error("Error rejecting application:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// Controller function to get all donors with total donation amount
const getAllDonors = async (req, res) => {
  try {
    const donors = await adminService.getAllDonors(); // Call service function to get all donors
    let totalDonation = 0;

    // Calculate total donation amount
    donors.forEach((donor) => {
      totalDonation += donor.amount;
    });

    // Return donors and total donation amount in the response
    res.status(200).json({ donors, totalDonation });
  } catch (error) {
    console.error("Error fetching donors:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await adminService.getAllFeedbacks(); // Implement this in the service
    res.status(200).json({ feedbacks });
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const replyToFeedback = async (req, res) => {
  try {
  
  
    const { feedbackId } = req.params;
    const { message } = req.body;

    // Implement logic to save reply in the database
    await adminService.replyToFeedback(feedbackId, message);

    res.status(200).json({ message: "Reply sent successfully" });
  } catch (error) {
    console.error("Error sending reply:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller function to get the NewsStrip visibility status
const getNewsStripVisibility = async (req, res) => {
  try {
    const isVisible = await adminService.getNewsStripVisibility();
    res.status(200).json({ isVisible });
  } catch (error) {
    console.error("Error fetching NewsStrip visibility:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller function to set the NewsStrip visibility status
const setNewsStripVisibility = async (req, res) => {
  try {
    const { isVisible } = req.body;
    await adminService.setNewsStripVisibility(isVisible);
    res.status(200).json({ message: "NewsStrip visibility updated successfully" });
  } catch (error) {
    console.error("Error updating NewsStrip visibility:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = {
  adminLogin,
  adminSignup,
  getAllUsers,
  toggleBlockUser,
  getAllApplications,
  approveApplication,
  rejectApplication,
  getAllDonors,
  getAllFeedbacks,
  replyToFeedback,
  getNewsStripVisibility,
  setNewsStripVisibility
};
