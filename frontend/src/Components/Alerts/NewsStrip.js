import React, { useContext,useState } from 'react';
import { NewsStripContext } from '../../Contexts/NewsStripContext';
import '../../Styles/NewsStrip.css';
import { useNavigate } from "react-router-dom";
import PopupAlert from "../Alerts/PopupAlert";

const NewsStrip = () => {
  const [alertSettings, setAlertSettings] = useState({
    type: "warning",
    message: "alert message",
  });
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);

  const { isNewsStripVisible } = useContext(NewsStripContext);
  const handleClick = () => {
    if (!token) {
      setShowAlert(true);
      setAlertSettings({
        type: "warning",
        message: "Sign in before Checking Results",
      });
    } else {
      navigate("/results");
    }
  };
  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const news = (
    <>
      Results have been declared..! Please check the Results page to see your score.{' '}
      <button  className="btn btn-link" onClick={handleClick}>Click here</button>.
    </>
  );

  return (
    isNewsStripVisible && (
      <>
      <div>{showAlert && (
        <PopupAlert
          type={alertSettings.type}
          message={alertSettings.message}
          onClose={handleCloseAlert}
        />
      )}</div>
      <div className="news-strip">

        <div className="news-content">
          {news}
        </div>
      </div>
      </>
    )
  );
};

export default NewsStrip;
