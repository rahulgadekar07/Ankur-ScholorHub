// userController.js

// Import necessary modules
const userService = require("../Services/userServices");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const multer = require("multer");
const path = require("path");

// Define storage for profile pictures
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './profile_images'); // Destination folder for storing profile pictures
  },
  filename: function (req, file, cb) {
    cb(null, 'profile_' + Date.now() + path.extname(file.originalname)); // Unique filename for each uploaded picture
  }
});

// Initialize multer upload
const upload = multer({ storage: storage });

// Controller function for user sign-up
async function signUp(req, res) {
  try {
    const { name, email, password } = req.body;
    await userService.createUser(name, email, password);
    res.status(201).send("User created successfully");
  } catch (error) {
    console.error("Error creating user:", error);
    // Check if the error message is 'Email already exists', and return a specific error response
    if (error.message === "Email already exists") {
      res.status(400).json({ error: "Email already exists" });
    } else {
      res.status(500).json({ error: "Error creating user" });
    }
  }
}

// Controller function for user sign-in
async function signIn(req, res) {
  try {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Query the database to find the user by email
    const user = await userService.findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare the provided password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log(passwordMatch);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, userName: user.name, email: user.email },
      "Ankur123",
      { expiresIn: "1h" }
    );

    // Send the token in the response
    res.status(200).json({ token });
  } catch (error) {
    console.error("Error signing in:", error);
    res.status(500).json({ error: "Error signing in" });
  }
}

async function getUserData(req, res) {
  try {
    // Extract user ID from JWT token
    const userId = req.user.userId;

    // Fetch user data from the database using the user ID
    const userData = await userService.getUserById(userId);

    res.status(200).json(userData);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Error fetching user data" });
  }
}

// Controller function for uploading profile picture
async function uploadProfilePic(req, res) {
  try {
    // Check if a file is uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Extract user ID from JWT token
    const userId = req.user.userId;

    // Update user record in the database with the path to the uploaded profile picture
    await userService.updateProfilePic(userId, req.file.path);

    res.status(200).json({ message: 'Profile picture uploaded successfully' });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({ error: 'Error uploading profile picture' });
  }
}

// Export controller functions
module.exports = {
  signUp,
  signIn,
  getUserData,
  uploadProfilePic,
  upload // Export the upload middleware for use in routes
};
