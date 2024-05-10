// paymentController.js
const Razorpay = require('razorpay');
const paymentService = require("../Services/paymentServices");

// Initialize Razorpay client with key ID and key secret
// Initialize Razorpay client with key ID and key secret
const razorpay = new Razorpay({
  key_id: 'rzp_test_GWCh8fO2Clvot3', // Use 'key' instead of 'key_id'
  key_secret: 'wuimrKCSsmfjhAMEJ2dI0Ywo'
});


// Controller function to handle donation request
const Donate = async (req, res) => {
    try {
        // Extract donation data from request body
        const { amount, name, email, userId } = req.body;
        
        // Create Razorpay order
        const order = await razorpay.orders.create({
          amount, // Convert amount to paise (currency subunit)
          currency: 'INR',
          payment_capture: 1 // Auto-capture payment after creation
        });
        
        // Process donation and store data in database using service function
        const donation = await paymentService.makeDonation(name, email, amount, order.id, userId);

        // Return Razorpay order details to frontend
        res.status(200).json({ order });
    } catch (error) {
        // Return an error response
        console.error("Error processing donation:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
    Donate
};
