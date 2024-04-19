const express = require("express");
const adminController = require("../Controller/adminController");

const router = express.Router();
router.post("/adminsignup",adminController.adminSignup);
router.post("/adminlogin",adminController.adminLogin);
router.get("/getusers",adminController.getAllUsers);
router.delete("/removeuser/:userId", adminController.removeUser); // Add :userId placeholder in the URL
module.exports = router;
