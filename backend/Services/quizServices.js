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


module.exports = {
  getAllQuestions,
  updateQuestion
};
