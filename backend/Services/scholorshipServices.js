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
// Function to save address details into the database
async function saveAddressDetails({ userId, permanent_address, current_address }) {
 
  try {
    // Prepare SQL query to insert address details
    const sql = `
      INSERT INTO address_details (user_id, permanent_address, permanent_state, permanent_district, permanent_taluka, permanent_city, permanent_pincode, current_address, current_state, current_district, current_taluka, current_city, current_pincode)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      userId,
      permanent_address.address,
      permanent_address.state,
      permanent_address.district,
      permanent_address.taluka,
      permanent_address.city,
      permanent_address.pincode,
      current_address.address,
      current_address.state,
      current_address.district,
      current_address.taluka,
      current_address.city,
      current_address.pincode
    ];

    // Execute the SQL query
    await db.promise().query(sql, values);
  } catch (error) {
    console.error("Error saving address details:", error);
    throw error;
  }
}
// Function to save income details into the database

async function saveIncomeDetails({
  userId,
  parentName,
  parentMobile,
  jobType,
  jobDescription,
  annualIncome,
  incomeCertificate
}) {
  console.log(
    userId,
    parentName,
    parentMobile,
    jobType,
    jobDescription,
    annualIncome,
    incomeCertificate
  );
  try {
    const sql = `
      INSERT INTO income_details (userId, parentName, parentMobile, jobType, jobDescription, annualIncome, incomeCertificate)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [userId, parentName, parentMobile, jobType, jobDescription, annualIncome, incomeCertificate];
    await db.promise().query(sql, values);
  } catch (error) {
    console.error("Error saving income details:", error);
    throw error;
  }
}

module.exports = {
  savePersonalDetails,
  saveIncomeDetails,
  saveAddressDetails
};
