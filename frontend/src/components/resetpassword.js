import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa"; // Import icons
import "../styles/ResetPassword.css";
import Dialog from "./Dialog"; // Import the Dialog component

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });
  const [showDialog, setShowDialog] = useState(false); // State for dialog visibility

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const validatePassword = (password) => {
    const errors = {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[@$!%*?&]/.test(password),
    };
    setPasswordErrors(errors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Check if the password meets all requirements
    if (
      !passwordErrors.minLength ||
      !passwordErrors.hasUppercase ||
      !passwordErrors.hasLowercase ||
      !passwordErrors.hasNumber ||
      !passwordErrors.hasSpecialChar
    ) {
      setError("Password does not meet the requirements");
      return;
    }

    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      console.log("Sending reset request with token:", token); // Log the token
      console.log("Sending reset request with newPassword:", newPassword); // Log the new password

      const response = await axios.post("http://localhost:5000/api/auth/reset-password", {
        token,
        newPassword,
      });

      setMessage(response.data.message);
      setShowDialog(true); // Show the success dialog

      // Navigate to login page after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Password</h2>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <div className="input-with-icon">
            <span className="input-icon">
              <FaLock /> {/* Lock icon */}
            </span>
            <input
              type={showNewPassword ? "text" : "password"}
              id="newPassword"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                validatePassword(e.target.value); // Validate password on change
              }}
              placeholder="Enter new password"
              required
            />
            {/* Show toggle icon only if the input has content */}
            {newPassword && (
              <span
                className="password-toggle-icon"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            )}
          </div>
          {/* Password validation messages */}
          <div className="password-validation">
            {!passwordErrors.minLength && <p>• At least 8 characters</p>}
            {!passwordErrors.hasUppercase && <p>• At least one uppercase letter</p>}
            {!passwordErrors.hasLowercase && <p>• At least one lowercase letter</p>}
            {!passwordErrors.hasNumber && <p>• At least one number</p>}
            {!passwordErrors.hasSpecialChar && <p>• At least one special character (@$!%*?&)</p>}
          </div>
        </div>
        <div className="form-group">
          <div className="input-with-icon">
            <span className="input-icon">
              <FaLock /> {/* Lock icon */}
            </span>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
            />
            {/* Show toggle icon only if the input has content */}
            {confirmPassword && (
              <span
                className="password-toggle-icon"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            )}
          </div>
        </div>
        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? "Resetting Password..." : "Reset Password"}
        </button>
      </form>

      {/* Success Dialog */}
      {showDialog && (
        <Dialog
          message="Password reset successful"
          onClose={() => setShowDialog(false)}
        />
      )}
    </div>
  );
};

export default ResetPassword;