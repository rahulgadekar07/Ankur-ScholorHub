const Razorpay = require('razorpay');
const paymentService = require("../Services/paymentServices");
const { sendEmail } = require('../Config/emailSender');

// Initialize Razorpay client with key ID and key secret
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});
const Donate = async (req, res) => {
  try {
    // Extract donation data from request body
    const { amount, name, email, userId } = req.body;
    const text = `Dear ${name},\n Thank you for your generous donation of ₹${(amount/100)} to Ankur Vidyarthi Foundation! Your support means the world to us and will help us improve the lives of poor students.`;
        
    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount, // Convert amount to paise (currency subunit)
      currency: 'INR',
      payment_capture: 1 // Auto-capture payment after creation
    });
        
    // Process donation and store data in database using service function
    const donationResult = await paymentService.makeDonation(name, email, amount, order.id, userId);
    
    // Check if donation was successful
    if (donationResult.success) {
      try {
        // Send email
        const emailSent = await sendEmail(email, "Thank You for Your Donation!", text);
        if (emailSent) {
          res.status(200).json({ message: 'Donation successful and email sent', order });
        } else {
          throw new Error('Failed to send email');
        }
      } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Failed to send email');
      }
    } else {
      throw new Error('Failed to process donation');
    }
  } catch (error) {
    // Return an error response
    console.error("Error processing donation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = {
    Donate
};
