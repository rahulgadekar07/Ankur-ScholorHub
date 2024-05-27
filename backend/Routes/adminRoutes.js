const express = require("express");
const adminController = require("../Controller/adminController");

const router = express.Router();
router.post("/adminsignup",adminController.adminSignup);
router.post("/adminlogin",adminController.adminLogin);
router.get("/getusers",adminController.getAllUsers);
router.get("/getAllApplications",adminController.getAllApplications);
router.delete("/removeuser/:userId", adminController.removeUser);
router.patch("/approveApplication/:applicationId",adminController.approveApplication) ;
router.patch("/rejectApplication/:selectedApplicationId",adminController.rejectApplication) ;
router.get('/getAllDonors', adminController.getAllDonors);
module.exports = router;
