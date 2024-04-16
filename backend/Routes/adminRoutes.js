const express = require("express");
const adminController = require("../Controller/adminController");

const router = express.Router();
router.post("/adminsignup",adminController.adminSignup);
router.post("/adminlogin",adminController.adminLogin);
module.exports = router;
