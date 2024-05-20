// paymentServices.js
const db = require('../Config/database');

const makeDonation = async (name, email, amount, payment_id, userId) => {
  try {
    const query = `
      INSERT INTO donations (user_id, name, email, amount, payment_id, created_at)
      VALUES (?, ?, ?, ?, ?, NOW())
    `;
    await db.promise().query(query, [userId, name, email, amount, payment_id]);
    return { success: true, message: 'Donation made successfully' };
  } catch (error) {
    console.error('Error making donation:', error);
    throw new Error('Error making donation');
  }
};


module.exports = {
  makeDonation
};
