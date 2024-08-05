import React, { useState } from "react";
import "../Styles/Contact.css"; // Import the CSS file
import { decodeToken } from "../Utils/auth";
import PopupAlert from "../Components/Alerts/PopupAlert";

const Contact = () => {
  const apiUrl=process.env.REACT_APP_URL;

  const [showAlert, setShowAlert] = useState(false);
  const [alertSettings, setAlertSettings] = useState({
    type: "warning",
    message: "alert message",
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const token = localStorage.getItem("token");

  // Check if token is null before decoding
  // if(token){
  //   let name=decodedToken.user;
  //   let 
  // }
  const decodedToken = token ? decodeToken(token) : null;
  const userId = decodedToken ? decodedToken.userId : null;
  const [errors, setErrors] = useState({});
console.log(decodedToken)
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    let formErrors = {};
    if (!formData.name) formErrors.name = "Name is required";
    if (!formData.email) {
      formErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      formErrors.email = "Email address is invalid";
    }
    if (!formData.subject) formErrors.subject = "Subject is required";
    if (!formData.message) formErrors.message = "Message is required";
    return formErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setShowAlert(true);
      setAlertSettings({
        type: "warning",
        message: "Please Sign in Before submitting feedback...!",
      });
    } else {
      const formErrors = validate();
      if (Object.keys(formErrors).length === 0) {
        try {
          // Append userId to formData
          const feedbackData = {
            ...formData,
            userId: userId,
          };

          const response = await fetch(
            `${apiUrl}/user/submit-feedback`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(feedbackData),
            }
          );
          if (response.ok) {
            setShowAlert(true);
            setAlertSettings({
              type: "success",
              message: "Feedback Submitted successfully ...!",
            });
            setFormData({
              name: "",
              email: "",
              subject: "",
              message: "",
            });
            setErrors({});
          } else {
            alert("Error submitting feedback.");
          }
        } catch (error) {
          console.error("Error submitting feedback:", error);
          alert("Error submitting feedback.");
        }
      } else {
        setErrors(formErrors);
      }
    }
  };
  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  return (
    <div className="contact-container">
      {showAlert && (
        <PopupAlert
          type={alertSettings.type}
          message={alertSettings.message}
          onClose={handleCloseAlert} // Pass function reference here
        />
      )}
      <h1>Contact Us</h1>
      <div className="contact-info">
        <p>
          <strong>Phone:</strong> (123) 456-7890
        </p>
        <p>
          <strong>Email:</strong>  ankur.vidyarthi.foundation@gmail.com
        </p>
        <p>
          <strong>Address:</strong> मु .पो. वेळू , ग्रामपंचायत कायाालय, दुसरा मजला , ता. कोरेगाव,जि. सातारा, ४१५५११
        </p>
        <p>
          <strong>Operating Hours:</strong> Mon-Fri 9:00 AM - 5:00 PM
        </p>
        <div className="social-media">
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Facebook
          </a>
          <a
            href="https://www.twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Twitter
          </a>
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </div>
        <div className="map">
          <iframe
            title="Google Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d78927.99469480693!2d74.20176019628322!3d17.56172028944616!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc3d310ed3ab985%3A0xb4dc1b253d1d8a3d!2z4KS14KWH4KSz4KWCIOCkl-CljeCksOCkvuCkriDgpKrgpILgpJrgpL7gpK_gpKQ!5e0!3m2!1sen!2sin!4v1713689725651!5m2!1sen!2sin"
            width="600"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
      <form onSubmit={handleSubmit} noValidate className="contact-form">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? "input-error" : ""}
          />
          {errors.name && <p className="error-message">{errors.name}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? "input-error" : ""}
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="subject">Subject:</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className={errors.subject ? "input-error" : ""}
          />
          {errors.subject && <p className="error-message">{errors.subject}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className={errors.message ? "input-error" : ""}
          ></textarea>
          {errors.message && <p className="error-message">{errors.message}</p>}
        </div>
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Contact;
