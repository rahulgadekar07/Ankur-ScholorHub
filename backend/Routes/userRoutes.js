// userRoutes.js

// Import necessary modules
const express = require('express');
const userController = require('../Controller/userController');

// Create a router
const router = express.Router();

// Define routes for user-related endpoints
router.post('/signup', userController.signUp);
router.post('/signin', userController.signIn);
// router.get('/user', userController.getUserData);
router.get('/getUserData', userController.getUserData); // Corrected route

router.post('/upload-profile-pic', userController.uploadProfilePic);


// Export the router
module.exports = router;
