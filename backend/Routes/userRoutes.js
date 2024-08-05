// userRoutes.js (path: backend\Routes\userRoutes.js)

// Import necessary modules
const express = require('express');
const userController = require('../Controller/userController');
const upload = userController.upload; // Import the upload middleware

// Create a router
const router = express.Router();

// Define routes for user-related endpoints
router.post('/signup', userController.signUp);
router.post('/signin', userController.signIn);
router.get('/getUserData', userController.getUserData); 
router.post('/submit-feedback', userController.submitFeedback); 
router.post('/upload-profile-pic', upload.single('profilePic'), userController.uploadProfilePic);

// Password Reset Routes
router.post('/forgot-password', userController.requestPasswordReset);
router.post('/verify-code', userController.verifyCode);
router.post('/reset-password', userController.resetPassword);
// Export the router
module.exports = router;
