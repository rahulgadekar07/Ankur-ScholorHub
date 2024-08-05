import React, { useState, useEffect } from "react";
import "../Styles/Home.css";
import { useNavigate } from "react-router-dom";
import PopupAlert from "../Components/Alerts/PopupAlert";
import { decodeToken } from "../Utils/auth";
import NewsStrip from "../Components/Alerts/NewsStrip"; // Import the NewsStrip component

const Home = () => {
  const [mapLoading, setMapLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [isNewsStripVisible, setIsNewsStripVisible] = useState(false); // New state for visibility
  const apiUrl = process.env.REACT_APP_URL;
  const [alertSettings, setAlertSettings] = useState({
    type: "warning",
    message: "alert message",
  });
  const token = localStorage.getItem("token");
  const decodedToken = decodeToken(token);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch NewsStrip visibility status
    const fetchNewsStripVisibility = async () => {
      try {
        const response = await fetch(`${apiUrl}/newsstripvisibility`);
        const data = await response.json();
        setIsNewsStripVisible(data.isVisible);
      } catch (error) {
        console.error("Error fetching NewsStrip visibility:", error);
      }
    };

    fetchNewsStripVisibility();

    // Simulate map loading delay
    const timer = setTimeout(() => {
      setMapLoading(false);
    }, 2000);

    // Cleanup function
    return () => clearTimeout(timer);
  }, [apiUrl]);

  const handleDonateClick = () => {
    if (!token) {
      setShowAlert(true);
      setAlertSettings({
        type: "warning",
        message: "Sign in before Donation",
      });
    } else {
      navigate("/donate");
    }
  };

  const handleApplyClick = async () => {
    if (!token) {
      setShowAlert(true);
      setAlertSettings({
        type: "warning",
        message: "Sign in before Apply",
      });
    }
    try {
      const userId = decodedToken.userId;

      const response = await fetch(
        `${apiUrl}/scholarship/checkApplicationStatus/${userId}`
      );
      const data = await response.json();
      console.log(data);
      console.log(data.userExists);
      if (data.userExists.exists) {
        setShowAlert(true);
        setAlertSettings({
          type: "failure",
          message: "You have already submitted your Application",
        });
      } else {
        navigate("/apply");
      }
    } catch (error) {
      console.error("Error checking user details:", error);
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  return (
    <div className="flex my-3">
      {/* Conditionally render NewsStrip based on visibility */}
      {isNewsStripVisible && <NewsStrip />}
      {showAlert && (
        <PopupAlert
          type={alertSettings.type}
          message={alertSettings.message}
          onClose={handleCloseAlert}
        />
      )}
      <div className="map1 m-4">
        {mapLoading && (
          <div className="loading-overlay m-3">
            <center>
              <div className="spinner"></div>
            </center>
          </div>
        )}
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d78927.99469480693!2d74.20176019628322!3d17.56172028944616!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc3d310ed3ab985%3A0xb4dc1b253d1d8a3d!2z4KS14KWH4KSz4KWCIOCkl-CljeCksOCkvuCkriDgpKrgpILgpJrgpL7gpK_gpKQ!5e0!3m2!1sen!2sin!4v1713689725651!5m2!1sen!2sin"
          width="100%"
          height="40%"
          style={{
            border: "0",
            borderRadius: "20px",
            display: mapLoading ? "none" : "block",
          }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={() => setMapLoading(false)}
        ></iframe>
      </div>

      <div className="content1 container text-center">
        <div
          className="newscontent"
          onMouseEnter={() => document.getElementById("marquee").stop()}
          onMouseLeave={() => document.getElementById("marquee").start()}
        >
          <marquee id="marquee" behavior="scroll" direction="up" scrollamount="7">
            <div className="marquee-item">
              <p className="my-2">Form acceptance for scholarships has started. Apply now!</p>
            </div>
            <div className="marquee-item">
              <p className="my-2">Please donate to support our cause. Every contribution counts!</p>
            </div>
            <div className="marquee-item">
              <p className="my-2">Volunteers needed for our upcoming event. Join us to make a difference!</p>
            </div>
          </marquee>
        </div>

        <div className="maincontent">
          <h1>Welcome to Ankur Foundation</h1>
          <p>Click below to apply for our scholarships:</p>
          <div className="apl">
            <button id="btn1" onClick={handleApplyClick}>
              Apply
            </button>
          </div>
          <p>Kindly Donate Us to Help more Students:</p>
          <div className="apl1">
            <button id="btn2" onClick={handleDonateClick}>
              Donate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
