const express = require("express");
const paymentController = require("../Controller/paymentController");

const router = express.Router();

router.post("/donate", paymentController.Donate); 

module.exports = router;
