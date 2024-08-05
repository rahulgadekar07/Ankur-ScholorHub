import React, { useEffect } from "react";
import "../../Styles/PopupAlert.css";

const PopupAlert = ({ type, message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // Close the alert after 3 seconds
    }, 3000);

    return () => clearTimeout(timer); // Clear the timer on component unmount or when onClose changes
  }, [onClose]);

  let alertClass = "";
  switch (type) {
    case "success":
      alertClass = "success";
      break;
    case "warning":
      alertClass = "warning";
      break;
    case "failure":
      alertClass = "failure";
      break;
    default:
      alertClass = "";
  }

  return (
    <div className={`popup-alert ${alertClass}`}>
      <p className="fw-bold p-3">{message}</p>
      <button className="close-btn " style={{ height: '30px', width: '30px', fontSize: '30px' }} onClick={onClose}>
        &times;
      </button>
    </div>
  );
};

export default PopupAlert;
