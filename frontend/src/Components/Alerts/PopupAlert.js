import React from "react";
import "../../Styles/PopupAlert.css";

const PopupAlert = ({ type, message, onClose }) => {
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
      <p className="fw-bold ">{message}</p>
      <button className="close-btn "style={{height:'30px',width:'30px',fontSize:'30px'}} onClick={onClose}>
        &times;
      </button>
    </div>
  );
};

export default PopupAlert;
