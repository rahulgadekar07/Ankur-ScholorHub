const mysql = require('mysql2');
const fs = require('fs');

// Create a MySQL database connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ankur',
  // ssl: {
  //   ca: fs.readFileSync(process.env.CA)
  // }
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');
});

// Export the database connection
module.exports = connection;
