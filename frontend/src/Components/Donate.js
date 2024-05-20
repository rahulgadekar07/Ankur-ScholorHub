import React, { useState } from "react";
import "../Styles/Donate.css"; // CSS file for styling
import { decodeToken } from "../Utils/auth";
import PopupAlert from '../Components/Alerts/PopupAlert';

const Donate = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [payment_id, setpayment_id] = useState("");
  const token = localStorage.getItem("token");
  const decodedToken = decodeToken(token);
  const userId = decodedToken.userId;

  const [showAlert, setShowAlert] = useState(false);
  const [alertSettings, setAlertSettings] = useState({
    type: 'warning',
    message: 'alert message',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const orderData = {
      name,
      email,
      amount: amount * 100, // Convert amount to paisa
      payment_id,
      userId,
    };
  
    try {
      const response = await fetch("http://localhost:5000/payment/donate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });
  
      if (!response.ok) {
        throw new Error("Failed to create order");
      }
  
      const options = {
        key: 'rzp_test_GWCh8fO2Clvot3',
        amount: amount * 100,
        // Other Razorpay options...
        handler: function (response) {
          const payment_id = response.razorpay_payment_id;
          orderData.payment_id = payment_id;
  
          // Update the order with payment_id on the backend
          fetch("http://localhost:5000/payment/donate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(orderData),
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Failed to process payment");
              }
              // Handle successful payment
              setShowAlert(true);
              setAlertSettings({
                type: 'success',
                message: 'Donation is Successfull.! Thank You Very Much',
              });// Show alert for successful donation
              setName("")
              setAmount("")
              setEmail("")
    
            })
            .catch((error) => {
              console.error("Error processing payment:", error);
            });
        },
      };
  
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleCloseAlert = () => {
    setShowAlert(false);
  };
  return (
    <div className="donate-container">
      {showAlert && (
        <PopupAlert
          type={alertSettings.type}
          message={alertSettings.message}
          onClose={handleCloseAlert}
        />
      )}
      <div className="row">
        <div className="col-md-6 donate-left">
          <div className="donate-header">
            <h1>Support Education for All</h1>
            <p>
              Your donation can help provide education to children in need
              around the world.
            </p>
          </div>
          <div className="donate-image-container">
            <img
              src="https://www.shutterstock.com/image-photo/graduate-study-abroad-program-broaden-600nw-2175509421.jpg"
              alt="Donate"
              className="donate-image"
            />
          </div>
        </div>
        <div className="col-md-6 donate-right">
          <div className="donate-form-container">
            <h2>Make a Donation</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="amount">Amount (INR):</label>
                <input
                  type="number"
                  id="amount"
                  className="form-control"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Donate Now
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;
