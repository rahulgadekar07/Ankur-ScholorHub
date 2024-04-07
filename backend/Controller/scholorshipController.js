const db = require("../Config/database");
const multer = require('multer');

// Configure Multer to store files in a specific directory
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './adhaar_uploads/') // Specify the directory where files should be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname) // Use a unique file name
  }
});

// Create multer instance with the configured storage options
const upload = multer({ storage: storage });

// Import scholarshipServices to call the savePersonalDetails function
const scholarshipServices = require("../Services/scholorshipServices");

// Function to handle file uploading and saving personal details
async function applyForScholarship(req, res) {
  try {
    // Handle file upload
    upload.single('aadharCard')(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        // Multer error occurred
        console.error('Multer error:', err);
        return res.status(500).json({ error: 'Error uploading file' });
      } else if (err) {
        // Other error occurred
        console.error('Error:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      // File upload successful, extract form data and file information
      const {
        userId,
        fullname,
        email,
        mobile,
        dob,
        gender
      } = req.body;
      const aadharCard = req.file ? req.file.path : null; // Store file path in database

      // Call service function to insert personal details into the database
      await scholarshipServices.savePersonalDetails({
        userId,
        fullname,
        email,
        mobile,
        dob,
        gender,
        aadharCard
      });

      // Send response
      res.status(201).json({ message: 'Personal details saved successfully' });
    });
  } catch (error) {
    console.error('Error applying for scholarship:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Function to retrieve application status
async function getApplicationStatus(req, res) {
  // Implement function to retrieve application status if needed
}

module.exports = {
  applyForScholarship,
  getApplicationStatus
};
