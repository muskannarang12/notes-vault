import React from "react";
import "../styles/Dialog.css"; // Add styles for the dialog

const Dialog = ({ message, onClose }) => {
  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Dialog;