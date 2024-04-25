const express = require("express");
const quizController = require("../Controller/quizController");

const router = express.Router();

router.get("/getallquestions",quizController.getAllQuestions)
router.put("/updatequestion",quizController.updateQuestion)
module.exports = router;
