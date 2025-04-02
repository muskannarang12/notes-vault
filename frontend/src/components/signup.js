import React, { useState, useEffect } from "react";
import axios from "axios";
import axiosInstance from '../api/axiosInstance';
import "../styles/Signup.css";
import { FaEye, FaEyeSlash, FaLock,  FaEnvelope } from "react-icons/fa"; // Import icons
const Signup = ({ isOpen, onClose, switchToLoginModal }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [passwordErrors, setPasswordErrors] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const [isPasswordBlurred, setIsPasswordBlurred] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setError("");
  }, [formData.email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "password") {
      validatePassword(value);
    }
  };

  const validatePassword = (password) => {
    const errors = {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[@$!%_*?&]/.test(password),
    };
    setPasswordErrors(errors);
  };

  const handlePasswordBlur = () => {
    setIsPasswordBlurred(true);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

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

    try {
      const response = await axiosInstance.post("/auth/signup", {
        email: formData.email,
        password: formData.password,
      });

      console.log("Signup successful:", response.data);

      setFormData({
        email: "",
        password: "",
        confirmPassword: "",
      });

      setDialogMessage("Signup successful. Please check your email to verify your account.");
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Signup error details:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      {/* Success Dialog - Displayed above the Signup component */}
      {isDialogOpen && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <p>{dialogMessage}</p>
            <button onClick={() => setIsDialogOpen(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Signup Container */}
      <div className="signup-container" onClick={(e) => e.stopPropagation()}>
        {/* Left Section - Only Image */}
        <div className="left-section">
          <div className="image-container">
            <img src="./assets/images.png" alt="White desk" />
          </div>
        </div>
        
        {/* Right Section - Sign up form */}
        <div className="right-section">
          <div className="modal-header">
            <h2>Create Your Account Now</h2>
            <button onClick={onClose} className="close-button">×</button>
          </div>
          {/* Use the switchToLoginModal function */}
          <p className="join-text">
            Already have an account?{" "}
            <button
              onClick={switchToLoginModal}
              style={{ background: "none", border: "none", color: "#e91e63", cursor: "pointer", fontSize: "16px", fontWeight:"bold" }}
            >
              Signin here
            </button>
          </p>

          {error && <p className="error-message">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="input-with-icon">
                <span className="input-icon">  <FaEnvelope /></span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="E-mail"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <div className="input-with-icon">
                <span className="input-icon">
                <FaLock />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handlePasswordBlur}
                  placeholder="Password"
                  required
                  autoComplete="new-password"
                />
                <span
                  className="password-toggle-icon"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <FaEye />
                  ) : (
                   <FaEyeSlash />
                  )}
                </span>
              </div>
              {/* Password validation messages */}
              {isPasswordBlurred && (
                <div className="password-validation">
                  {!passwordErrors.minLength && <p>• At least 8 characters</p>}
                  {!passwordErrors.hasUppercase && <p>• At least one uppercase letter</p>}
                  {!passwordErrors.hasLowercase && <p>• At least one lowercase letter</p>}
                  {!passwordErrors.hasNumber && <p>• At least one number</p>}
                  {!passwordErrors.hasSpecialChar && <p>• At least one special character (@$!%*?&)</p>}
                </div>
              )}
            </div>
            <div className="form-group">
              <div className="input-with-icon">
                <span className="input-icon">
                <FaLock />
                </span>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  required
                  autoComplete="new-password"
                />
                <span
                  className="password-toggle-icon"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? (
                   <FaEye />
                  ) : (
                    <FaEyeSlash />
                  )}
                </span>
              </div>
            </div>
            <button type="submit" className="signup-button" disabled={isLoading}>
              {isLoading ? "Signing Up..." : "Sign Up"}
              <span className="button-arrow">
                <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#ffffff">
                  <path d="M400-280v-400l200 200-200 200Z"/>
                </svg>
              </span>
            </button>
          </form>
          
          <div className="divider">
            <span>OR</span>
          </div>
          
          {/* Social login buttons */}
          <button className="social-button">
            <span className="social-icon">G</span>
            Continue with Google
          </button>
          <button className="social-button">
            <span className="social-icon">F</span>
            Continue with FaceBook
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;