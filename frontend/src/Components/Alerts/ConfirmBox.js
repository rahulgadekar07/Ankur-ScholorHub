import React, { useState } from 'react';
import "../../Styles/ConfirmBox.css";

const ConfirmBox = ({ message, onConfirm }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleConfirm = (choice) => {
    setIsOpen(false);
    onConfirm(choice === 'ok');
  };

  return (
    <div className={`confirm-box ${isOpen ? 'open' : 'closed'}`}>
      <div className="confirm-backdrop"></div>
      <div className="confirm-modal">
        <div className="confirm-message">{message}</div>
        <div className="button-container">
          <button className="confirm-button ok" onClick={() => handleConfirm('ok')}>OK</button>
          <button className="confirm-button cancel" onClick={() => handleConfirm('cancel')}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmBox;
