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


// Function to handle saving of address details
async function saveAddressDetails(req, res) {
  try {
    // Extract address details from request body
    const { userId, permanent_address, current_address  } = req.body;
    console.log(userId, permanent_address, current_address )
    // Call service function to save address details
    await scholarshipServices.saveAddressDetails({userId, permanent_address, current_address  });

    // Send success response
    res.status(201).json({ message: 'Address details saved successfully' });
  } catch (error) {
    console.error('Error saving address details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


// Configure Multer to store files in a specific directory
const storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './income_certificates/') // Specify the directory where files should be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname) // Use a unique file name
  }
});

// Create multer instance with the configured storage options
const upload2 = multer({ storage: storage2 });

// Function to handle file uploading and saving income details
async function saveIncomeDetails(req, res) {
  try {
    // Handle file upload
    upload2.single('incomeCertificate')(req, res, async function (err) {
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
        parentName,
        parentMobile,
        jobType,
        jobDescription,
        annualIncome
      } = req.body;
      const incomeCertificate = req.file ? req.file.path : null; // Store file path in database

      // Call service function to insert income details into the database
      await scholarshipServices.saveIncomeDetails({
        userId,
        parentName,
        parentMobile,
        jobType,
        jobDescription,
        annualIncome,
        incomeCertificate
      });

      // Send response
      res.status(201).json({ message: 'Income details saved successfully' });
    });
  } catch (error) {
    console.error('Error saving income details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}



// Function to retrieve application status
async function getApplicationStatus(req, res) {
  // Implement function to retrieve application status if needed
}



module.exports = {
  applyForScholarship,
  saveAddressDetails,
  saveIncomeDetails,
  getApplicationStatus
};
