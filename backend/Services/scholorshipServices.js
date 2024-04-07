const db = require("../Config/database");

async function savePersonalDetails({
  userId,
  fullname,
  email,
  mobile,
  dob,
  gender,
  aadharCard
}) {
  console.log(userId,
    fullname,
    email,
    mobile,
    dob,
    gender,
    aadharCard)
  try {
    const sql = `
      INSERT INTO personal_details (userId, fullname, email, mobile, dob, gender, aadharCard)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [userId, fullname, email, mobile, dob, gender, aadharCard];
    await db.promise().query(sql, values);
  } catch (error) {
    console.error("Error saving personal details:", error);
    throw error;
  }
}

module.exports = {
  savePersonalDetails
};
