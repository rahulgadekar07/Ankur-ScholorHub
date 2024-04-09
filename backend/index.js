// index.js

const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const userRoutes = require('./Routes/userRoutes');
const scholarshipRoutes=require('./Routes/scholorshipRoutes')
const cors=require('cors');

const app = express();
app.use(express.json());

// Middleware to parse JSON request bodies
app.use(bodyParser.json());
app.use(cors())

// Middleware to decode JWT token and set user information in request object
app.use((req, res, next) => {
  const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
  if (token) {
    jwt.verify(token, 'Ankur123', (err, decoded) => {
      if (err) {
        // Token is invalid
        req.user = null;
      } else {
        // Token is valid, set user information in request object
        req.user = decoded;
      }
      next();
    });
  } else {
    // No token provided
    req.user = null;
    next();
  }
});

// Routes
app.use('/user', userRoutes);
app.use('/scholarship', scholarshipRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
