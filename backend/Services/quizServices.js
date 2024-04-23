// quizServices.js
const db = require('../Config/database');

const getAllQuestions = async () => {
  try {
    const [rows, fields] = await db.promise().query("SELECT * FROM questions");
    return rows;
  } catch (error) {
    console.error('Error fetching questions from the database:', error);
    throw new Error('Error fetching questions from the database');
  }
};

module.exports = {
  getAllQuestions
};
