const db = require("../Config/database");
const multer = require("multer");
const { sendEmail } = require("../Config/emailSender");

// Configure Multer to store files in a specific directory
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./adhaar_uploads/"); // Specify the directory where files should be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Use a unique file name
  },
});

// Create multer instance with the configured storage options
const upload = multer({ storage: storage });

// Import scholarshipServices to call the savePersonalDetails function
const scholarshipServices = require("../Services/scholorshipServices");

// Function to handle file uploading and saving personal details
async function applyForScholarship(req, res) {
  try {
    // Handle file upload
    upload.single("aadharCard")(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        // Multer error occurred
        console.error("Multer error:", err);
        return res.status(500).json({ error: "Error uploading file" });
      } else if (err) {
        // Other error occurred
        console.error("Error:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      // File upload successful, extract form data and file information
      const { userId, fullname, email, mobile, dob, gender } = req.body;
      const aadharCard = req.file ? req.file.path : null; // Store file path in database

      // Call service function to insert personal details into the database
      await scholarshipServices.savePersonalDetails({
        userId,
        fullname,
        email,
        mobile,
        dob,
        gender,
        aadharCard,
      });

      // Send response
      res.status(201).json({ message: "Personal details saved successfully" });
    });
  } catch (error) {
    console.error("Error applying for scholarship:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Function to handle saving of address details
async function saveAddressDetails(req, res) {
  try {
    // Extract address details from request body
    const { userId, permanent_address, current_address } = req.body;
    // Call service function to save address details
    await scholarshipServices.saveAddressDetails({
      userId,
      permanent_address,
      current_address,
    });

    // Send success response
    res.status(201).json({ message: "Address details saved successfully" });
  } catch (error) {
    console.error("Error saving address details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// saving income details
// Configure Multer to store files in a specific directory
const storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./income_certificates/"); // Specify the directory where files should be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Use a unique file name
  },
});

// Create multer instance with the configured storage options
const upload2 = multer({ storage: storage2 });

// Function to handle file uploading and saving income details
async function saveIncomeDetails(req, res) {
  try {
    // Handle file upload
    upload2.single("incomeCertificate")(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        // Multer error occurred
        console.error("Multer error:", err);
        return res.status(500).json({ error: "Error uploading file" });
      } else if (err) {
        // Other error occurred
        console.error("Error:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      // File upload successful, extract form data and file information
      const {
        userId,
        parentName,
        parentMobile,
        jobType,
        jobDescription,
        annualIncome,
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
        incomeCertificate,
      });

      // Send response
      res.status(201).json({ message: "Income details saved successfully" });
    });
  } catch (error) {
    console.error("Error saving income details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

const storage3 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./Institue_Idcard/"); // Specify the directory where files should be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Use a unique file name
  },
});

const upload3 = multer({
  storage: storage3,
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg)$/)) {
      return cb(new Error("Only JPG files are allowed!"));
    }
    cb(null, true);
  },
});

// Function to handle file uploading and saving education details
async function saveEducationDetails(req, res) {
  try {
    // Handle file upload
    upload3.single("idCard")(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        // Multer error occurred
        console.error("Multer error:", err);
        return res.status(500).json({ error: "Error uploading file" });
      } else if (err) {
        // Other error occurred
        console.error("Error:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      // File upload successful, extract form data and file information
      const {
        email,
        userId,
        qualification,
        courseName,
        institute,
        currentYear,
      } = req.body;
      const idCard = req.file ? req.file.path : null; // Store file path in database

      // Call service function to insert education details into the database
      const result = await scholarshipServices.saveEducationDetails({
        userId,
        qualification,
        courseName,
        institute,
        currentYear,
        idCard,
        email
      });
      if (result) {
        const text =
          "User Successfully Applied for Scholorship....! Check Profile to view Details..";
        try {
          const emailSent = await sendEmail(
            email,
            "Scholorship Application Successfull",
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
      // Send response
      res.status(201).json({ message: "Education details saved successfully" });
    });
  } catch (error) {
    console.error("Error saving education details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Function to retrieve application status
async function checkApplicationStatus(req, res) {
  try {
    const userId = req.params.userId;
    const userExists = await scholarshipServices.checkApplicationStatus(userId);
    res.json({ userExists });
  } catch (error) {
    console.error("Error checking application status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// scholarshipController.js

// Function to check if the user has submitted personal details
async function checkPersonalDetails(req, res) {
  try {
    const userId = req.params.userId;

    const detailsExist = await scholarshipServices.checkPersonalDetails(userId);
    res.json({ detailsExist });
  } catch (error) {
    console.error("Error checking personal details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
// Function to check if the user has submitted Income details
async function checkIncomeDetails(req, res) {
  try {
    const userId = req.params.userId;

    const detailsExist1 = await scholarshipServices.checkIncomeDetails(userId);
    res.json({ detailsExist1 });
  } catch (error) {
    console.error("Error checking Income details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
// Function to check if the user has submitted Address details
async function checkAddressDetails(req, res) {
  try {
    const userId = req.params.userId;

    const detailsExist2 = await scholarshipServices.checkAddressDetails(userId);
    res.json({ detailsExist2 });
  } catch (error) {
    console.error("Error checking Address details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
// Function to check if the user has submitted Address details
async function checkEducationDetails(req, res) {
  try {
    const userId = req.params.userId;

    const detailsExist3 = await scholarshipServices.checkEducationDetails(
      userId
    );
    res.json({ detailsExist3 });
  } catch (error) {
    console.error("Error checking Address details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Functions to retrieve all personal details for a user
async function getAllPersonalDetails(req, res) {
  try {
    const userId = req.params.userId;
    const personalDetails = await scholarshipServices.getAllPersonalDetails(
      userId
    );
    res.json(personalDetails);
  } catch (error) {
    console.error("Error retrieving personal details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Function to retrieve all income details for a user
async function getAllIncomeDetails(req, res) {
  try {
    const userId = req.params.userId;
    const incomeDetails = await scholarshipServices.getAllIncomeDetails(userId);
    res.json(incomeDetails);
  } catch (error) {
    console.error("Error retrieving income details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Function to retrieve all address details for a user
async function getAllAddressDetails(req, res) {
  try {
    const userId = req.params.userId;
    const addressDetails = await scholarshipServices.getAllAddressDetails(
      userId
    );
    res.json(addressDetails);
  } catch (error) {
    console.error("Error retrieving address details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Function to retrieve all education details for a user
async function getAllEducationDetails(req, res) {
  try {
    const userId = req.params.userId;
    const educationDetails = await scholarshipServices.getAllEducationDetails(
      userId
    );
    res.json(educationDetails);
  } catch (error) {
    console.error("Error retrieving education details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Function to delete the application data for a user
async function deleteApplication(req, res) {
  try {
    const userId = req.params.userId;

    // Call the service function to delete the application data
    await scholarshipServices.deleteApplication(userId);

    // Send a success response
    res.status(200).json({ message: "Application data deleted successfully" });
  } catch (error) {
    console.error("Error deleting application data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}


// Function to retrieve all documents for a user
async function getAllDocuments(req, res) {
  try {
    const userId = req.params.userId;

    // Call the service function to get all documents for the user
    const documents = await scholarshipServices.getAllDocuments(userId);

    // Send the documents as a response
    res.json(documents);
  } catch (error) {
    console.error("Error retrieving documents:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
// Other controller functions...

module.exports = {
  applyForScholarship,
  saveAddressDetails,
  saveIncomeDetails,
  saveEducationDetails,

  checkApplicationStatus,
  deleteApplication,

  checkPersonalDetails,
  checkIncomeDetails,
  checkAddressDetails,
  checkEducationDetails,

  getAllPersonalDetails,
  getAllIncomeDetails,
  getAllAddressDetails,
  getAllEducationDetails,

  getAllDocuments
};
