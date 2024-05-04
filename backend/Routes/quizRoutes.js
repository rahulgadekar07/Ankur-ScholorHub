const express = require("express");
const quizController = require("../Controller/quizController");

const router = express.Router();

router.get("/getallquestions",quizController.getAllQuestions)
router.put("/updatequestion",quizController.updateQuestion)
router.put("/updatequestion",quizController.updateQuestion)
router.post("/saveQuizResult",quizController.saveQuizResult)
router.post("/checkUserQuizStatus",quizController.checkUserQuizStatus)
router.get("/getQuizResults", quizController.getQuizResults);

module.exports = router;
