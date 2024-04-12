// scholarshipRoutes.js

const express = require("express");
const scholarshipController = require("../Controller/scholorshipController");

const router = express.Router();

// Define routes for scholarship-related endpoints
router.post("/applyPd",  scholarshipController.applyForScholarship);
router.post("/applyAd",  scholarshipController.saveAddressDetails);
router.post("/applyId",  scholarshipController.saveIncomeDetails);
router.post("/applyEd",  scholarshipController.saveEducationDetails);
router.get("/checkPersonalDetails/:userId", scholarshipController.checkPersonalDetails);
router.get("/checkAddressDetails/:userId", scholarshipController.checkAddressDetails);
router.get("/checkIncomeDetails/:userId", scholarshipController.checkIncomeDetails);
router.get("/checkEducationDetails/:userId", scholarshipController.checkEducationDetails);
router.get("/checkApplicationStatus/:userId", scholarshipController.checkApplicationStatus);

// Export the router
module.exports = router;
