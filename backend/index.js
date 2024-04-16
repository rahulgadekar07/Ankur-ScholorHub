// index.js
const path = require('path');
const nodemailer = require('nodemailer');

const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const userRoutes = require('./Routes/userRoutes');
const scholarshipRoutes=require('./Routes/scholorshipRoutes')
const adminRoutes=require('./Routes/adminRoutes')
const cors=require('cors');

const app = express();
app.use(express.json());
app.use('/profile_images', express.static(path.join(__dirname, 'profile_images')));

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
app.use('/admin', adminRoutes);
app.post('/api/send-email', async (req, res) => {
  const { to, subject, body } = req.body;

  try {
    // Create a transporter object using SMTP transport
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'gadekarrahul804@gmail.com', // Your Gmail address
        pass: '#Rahul@2001', // Your Gmail password
      },
    });

    // Define email options
    const mailOptions = {
      from: 'gadekarrahul804@gmail.com',
      to,
      subject,
      text: body,
    };
    console.log("mail options",mailOptions)
    // Send email
    await transporter.sendMail(mailOptions);

    console.log('Email sent successfully');
    res.status(200).send('Email sent successfully');
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
