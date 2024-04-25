// quizController.js
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

module.exports = {
  getAllQuestions,
  updateQuestion
};
