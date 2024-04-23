// quizController.js
const quizServices = require('../Services/quizServices');
const getAllQuestions = async (req, res) => {
  try {
    const questions = await quizServices.getAllQuestions();
    res.json(questions);
    console.log("efinweuininiwefiffweiofiof:- ",questions)
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Error fetching questions from the database' });
  }
  
};

module.exports = {
  getAllQuestions
};
