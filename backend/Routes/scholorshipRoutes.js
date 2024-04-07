// scholarshipRoutes.js

const express = require("express");
const scholarshipController = require("../Controller/scholorshipController");

const router = express.Router();

// Define routes for scholarship-related endpoints
router.post("/apply",  scholarshipController.applyForScholarship);
router.get("/status",  scholarshipController.getApplicationStatus);

// Export the router
module.exports = router;
