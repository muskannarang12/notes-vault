import React, { useState } from "react";
import axios from "axios";
import { FaEnvelope } from "react-icons/fa"; // Import email icon
import "../styles/ForgotPassword.css";

const ForgotPassword = ({ isOpen, onClose, switchToLogin }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true); // Start loading
    setError("");
    setMessage("");

    try {
      const response = await axios.post("http://localhost:5000/api/auth/forgot-password", {
        email,
      });

      setMessage(response.data.message);
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="forgot-password-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Forgot Password</h2>
          <button onClick={onClose} className="close-button">×</button>
        </div>
        <p>Enter your email to receive a password reset link.</p>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="input-with-icon">
              <span className="input-icon">
                <FaEnvelope /> {/* Email icon */}
              </span>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? "Sending Reset Link..." : "Send Reset Link"}
          </button>
        </form>
        <p className="back-to-login" onClick={switchToLogin}>
          Back to Login
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;