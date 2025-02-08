// paymentServices.js
const db = require("../Config/database");

const makeDonation = async (name, email, amount, payment_id, userId) => {
  try {
    // Check for recent donation by the same user within 2 minutes
    const recentDonationQuery = `
      SELECT COUNT(*) AS count
      FROM donations
      WHERE user_Id = ? AND created_at >= NOW() - INTERVAL 2 MINUTE
    `;
    const [rows] = await db.promise().query(recentDonationQuery, [userId]);
    const recentDonationCount = rows[0].count;

    if (!recentDonationCount > 0) {
      // If a recent donation exists, return without inserting a new record
      // Insert the donation record into the database
      const insertQuery = `
    INSERT INTO donations (user_Id, name, email, amount, payment_id, created_at)
    VALUES (?, ?, ?, ?, ?, NOW())
  `;
      await db
        .promise()
        .query(insertQuery, [userId, name, email, (amount/100), payment_id]);

      // Return success message
      return { success: true, message: "Donation made successfully" };
    }
    else{
      return { success: true, message: "Donation made successfully" };

    }
  } catch (error) {
    console.error("Error making donation:", error);
    throw new Error("Error making donation");
  }
};

module.exports = {
  makeDonation,
};
