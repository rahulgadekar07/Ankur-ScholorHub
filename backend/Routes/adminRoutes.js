//adminRoutes.js (path: backend\Routes\adminRoutes.js)

const express = require("express");
const adminController = require("../Controller/adminController");

const router = express.Router();
// adminRoutes.js
router.get('/getAllFeedbacks', adminController.getAllFeedbacks);
router.post('/replyToFeedback/:feedbackId', adminController.replyToFeedback);
router.get("/newsstripvisibility", adminController.getNewsStripVisibility);
router.post("/newsstripvisibility", adminController.setNewsStripVisibility);

router.post("/adminsignup",adminController.adminSignup);
router.post("/adminlogin",adminController.adminLogin);
router.get("/getusers",adminController.getAllUsers);
router.get("/getAllApplications",adminController.getAllApplications);
router.patch("/blockuser/:userId", adminController.toggleBlockUser);
router.patch("/approveApplication/:applicationId",adminController.approveApplication) ;
router.patch("/rejectApplication/:selectedApplicationId",adminController.rejectApplication) ;
router.get('/getAllDonors', adminController.getAllDonors);
module.exports = router;
