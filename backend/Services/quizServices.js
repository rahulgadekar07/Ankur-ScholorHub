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

const updateQuestion = async (questionData) => {
  const { question_id, question, option1, option2, option3, option4, right_option } = questionData;

  try {
    await db.promise().query(
      "UPDATE questions SET question = ?, option1 = ?, option2 = ?, option3 = ?, option4 = ?, right_option = ? WHERE question_id = ?",
      [question, option1, option2, option3, option4, right_option, question_id]
    );
    return { success: true };
  } catch (error) {
    console.error('Error updating question in the database:', error);
    throw new Error('Error updating question in the database');
  }
};

const saveQuizResult = async (userId, score, result,email) => {
  try {
    const query = `
      INSERT INTO quiz_results (userId, score, result,email)
      VALUES (?, ?, ?,?)
    `;
    const [resultRows, fields] = await db.promise().query(query, [userId, score, result,email]);
    return resultRows;
  } catch (error) {
    console.error('Error saving quiz result to the database:', error);
    throw new Error('Error saving quiz result to the database');
  }
};
const checkUserQuizStatus = async (userId) => {
  try {
    const [rows, fields] = await db.promise().query(
      "SELECT COUNT(*) AS count FROM quiz_results WHERE userId = ?",
      [userId]
    );
    const hasSubmittedQuiz = rows[0].count > 0;
    return { hasSubmittedQuiz };
  } catch (error) {
    console.error('Error checking user quiz status:', error);
    throw new Error('Error checking user quiz status');
  }
};


const getQuizResults = async () => {
  try {
    const [rows, fields] = await db.promise().query("SELECT * FROM quiz_results");
    return rows;
  } catch (error) {
    console.error('Error fetching quiz results from the database:', error);
    throw new Error('Error fetching quiz results from the database');
  }
};
const getUserQuizResults = async (userId) => {
  try {
    const [results] = await db.promise().query('SELECT * FROM quiz_results WHERE userId = ?', [userId]);
    console.log('Quiz results:', results); // Log the results to check the output
    return results;
  } catch (error) {
    console.error('Error fetching user quiz results:', error);
    throw error;
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
