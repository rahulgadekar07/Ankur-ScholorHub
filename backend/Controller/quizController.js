// quizController.js (path: backend\Controller\quizController.js)
const quizServices = require('../Services/quizServices');
const getAllQuestions = async (req, res) => {
  try {
    const questions = await quizServices.getAllQuestions();
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Error fetching questions from the database' });
  }
  
};

const updateQuestion = async (req, res) => {
  const { question_id, question, option1, option2, option3, option4, right_option } = req.body;

  if (!question_id || !question || !option1 || !option2 || !option3 || !option4 || !right_option) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const updatedQuestion = await quizServices.updateQuestion(req.body);
    res.json(updatedQuestion);
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({ error: 'Error updating question in the database' });
  }
};


const saveQuizResult = async (req, res) => {
  const { userId, score, result ,email } = req.body;

  if (!userId || !score || !result || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const savedResult = await quizServices.saveQuizResult(userId, score, result,email);
    res.status(201).json({ success: true, message: 'Quiz result saved successfully', savedResult });
  } catch (error) {
    console.error('Error saving quiz result:', error);
    res.status(500).json({ error: 'Failed to save quiz result' });
  }
};

const checkUserQuizStatus = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const quizStatus = await quizServices.checkUserQuizStatus(userId);
    res.json(quizStatus);
  } catch (error) {
    console.error('Error checking user quiz status:', error);
    res.status(500).json({ error: 'Error checking user quiz status' });
  }
};

const getQuizResults = async (req, res) => {
  try {
    const quizResults = await quizServices.getQuizResults();
    res.json(quizResults);
  } catch (error) {
    console.error('Error fetching quiz results:', error);
    res.status(500).json({ error: 'Error fetching quiz results from the database' });
  }
};
const getUserQuizResults = async (req, res) => {
  try {
    const { userId } = req.params;
    const results = await quizServices.getUserQuizResults(userId);
    res.status(200).json({ results });
  } catch (error) {
    console.error("Error fetching quiz results:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllQuestions,
  updateQuestion,
  saveQuizResult,
  checkUserQuizStatus,
  getQuizResults,
  getUserQuizResults
};
