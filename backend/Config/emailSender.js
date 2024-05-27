// emailSender.js
const nodemailer = require('nodemailer');

async function sendEmail(to, subject, body) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'ankurvidyarthifoundation1@gmail.com', // Your Gmail address
        pass: 'ypri fuek ryci hzge', // Your Gmail app-specific password
      },
    });

    const mailOptions = {
      from: 'ankurvidyarthifoundation1@gmail.com',
      to,
      subject,
      text: body,
    };

    console.log("mail options", mailOptions);
    
    await transporter.sendMail(mailOptions);

    console.log('Email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

module.exports = { sendEmail };
