// emailSender.js
const nodemailer = require('nodemailer');

async function sendEmail(to, subject, body) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'gadekarrahul804@gmail.com', // Your Gmail address
        pass: 'nqnp fnqy haqy aunm', // Your Gmail app-specific password
      },
    });

    const mailOptions = {
      from: 'gadekarrahul804@gmail.com',
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
