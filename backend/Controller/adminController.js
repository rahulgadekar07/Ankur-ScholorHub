const adminService = require('../Services/adminServices');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// Controller function for admin signup
const adminSignup = async (req, res) => {
  try {
    // Extract admin details from the request body
    const { adminname, email, password } = req.body;
    console.log( adminname, email, password)
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
    console.log("Email fetched in controller:- ",email)
    console.log("/nPassword fetched in controller:- ",password)

    // Call the admin service to verify admin credentials
    const admin = await adminService.adminLogin(email, password);
    // If admin not found or password doesn't match, return error response
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    console.log("admin:- ",admin)

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


module.exports = {
  adminLogin,
  adminSignup
};