const path = require('path');
const { sendEmail } = require('./Config/emailSender');
require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');
const userRoutes = require('./Routes/userRoutes');
const scholarshipRoutes = require('./Routes/scholorshipRoutes'); // Check if the file name is correct
const adminRoutes = require('./Routes/adminRoutes');
const quizRoutes = require('./Routes/quizRoutes');
const salesItemRoutes = require('./Routes/salesItemRoutes');
const paymentRoutes = require('./Routes/paymentRoutes');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Serve static files
app.use('/profile_images', express.static(path.join(__dirname, 'profile_images')));
app.use('/adhaar_uploads', express.static(path.join(__dirname, 'adhaar_uploads')));
app.use('/income_certificates', express.static(path.join(__dirname, 'income_certificates')));
app.use('/Institue_Idcard', express.static(path.join(__dirname, 'Institue_Idcard')));
app.use('/sales_items', express.static(path.join(__dirname, 'sales_items')));

// Middleware to decode JWT token and set user information in request object
app.use((req, res, next) => {
  const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
  if (token) {
    jwt.verify(token, 'Ankur123', (err, decoded) => {
      if (err) {
        // Token is invalid or expired
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
app.use('/admin', adminRoutes);
app.use('/quiz', quizRoutes);
app.use('/sales', salesItemRoutes);
app.use('/payment', paymentRoutes);

// Email sending endpoint
app.post('/api/send-email', async (req, res) => {
  const { to, subject, body } = req.body;
  try {
    const emailSent = await sendEmail(to, subject, body);
    if (emailSent) {
      res.status(200).send('Email sent successfully');
    } else {
      res.status(500).send('Failed to send email');
    }
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Failed to send email');
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
