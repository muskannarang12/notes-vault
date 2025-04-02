import React, { useState } from "react";
import axiosInstance from '../api/axiosInstance';
import "../styles/Signup.css";
import { FaEye, FaEyeSlash, FaLock, FaEnvelope } from "react-icons/fa";

const Login = ({ isOpen, onClose, switchToSignupModal, switchToForgotPassword, onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
    const [isPasswordBlurred, setIsPasswordBlurred] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handlePasswordBlur = () => {
    setIsPasswordBlurred(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    setIsLoading(true);
    setError("");
  
    try {
      console.log("Sending login request with email:", formData.email); // Log the email
      console.log("Sending login request with password:", formData.password); // Log the password
  
      const response = await axiosInstance.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });
      console.log("Login successful:", response.data);
  
      setFormData({
        email: "",
        password: "",
      });
  
      onLoginSuccess(response.data.token); // Notify parent component (Navbar)
    } catch (error) {
      console.error("Login error details:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="signup-container" onClick={(e) => e.stopPropagation()}>
        {/* Left Section - Only Image */}
        <div className="left-section">
          <div className="image-container">
            <img src="./assets/images.png" alt="White desk" />
          </div>
        </div>

        {/* Right Section - Login form */}
        <div className="right-section">
          <div className="modal-header">
            <h2>Login to Your Account</h2>
            <button onClick={onClose} className="close-button">×</button>
          </div>
          <p className="join-text">
            Don't have an account?{" "}
            <button
              onClick={switchToSignupModal}
              style={{ background: "none", border: "none", color: "#e91e63", cursor: "pointer", fontSize: "16px", fontWeight: "bold" }}
            >
              Signup here
            </button>
          </p>

          {error && <p className="error-message">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="input-with-icon">
                <span className="input-icon">
                  <FaEnvelope />
                </span>
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
              <p className="forgot-password">
                <button
                  onClick={switchToForgotPassword}
                  style={{ background: "none", border: "none", color: "#e91e63", cursor: "pointer", fontSize: "16px", fontWeight: "bold" }}
                >
                  Forgot Password?
                </button>
              </p>
            </div>
            <button type="submit" className="signup-button" disabled={isLoading}>
              {isLoading ? "Logging In..." : "Login"}
              <span className="button-arrow">
                <svg xmlns="http://www.w3.org/2000/svg" height="48px" viewBox="0 -960 960 960" width="48px" fill="#ffffff">
                  <path d="M400-280v-400l200 200-200 200Z" />
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
            <span className="social-icon">✉</span>
            Continue with email/username
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;