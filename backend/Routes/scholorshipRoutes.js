// scholarshipRoutes.js

const express = require("express");
const scholarshipController = require("../Controller/scholorshipController");

const router = express.Router();

// Define routes for scholarship-related endpoints
router.post("/applyPd",  scholarshipController.applyForScholarship);
router.post("/applyAd",  scholarshipController.saveAddressDetails);
router.post("/applyId",  scholarshipController.saveIncomeDetails);
router.get("/status",  scholarshipController.getApplicationStatus);

// Export the router
module.exports = router;
