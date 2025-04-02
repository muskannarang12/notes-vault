import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import Login from "../components/login";
import Signup from "../components/signup";

const Home = () => {
  const [loaded, setLoaded] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
      return;
    }
    
    // Only run animation if not logged in
    setTimeout(() => setLoaded(true), 300);
  }, [navigate]);

  const openLogin = () => {
    setShowLogin(true);
    setShowSignup(false);
  };

  const openSignup = () => {
    setShowSignup(true);
    setShowLogin(false);
  };

  const closeModals = () => {
    setShowLogin(false);
    setShowSignup(false);
  };

  const handleLoginSuccess = (token) => {
    localStorage.setItem("token", token);
    closeModals();
    navigate("/dashboard");
  };

  // Don't render anything if redirecting to dashboard
  if (localStorage.getItem("token")) {
    return null;
  }

  return (
    <div className="home-container">
      <div className={`welcome-content ${loaded ? "loaded" : ""}`}>
        <h1 className="welcome-title">
          <span className="title-part">Welcome to </span>
          <span className="title-part accent">Notes Vault</span>
        </h1>
        <p className="welcome-subtitle">Your secure place for all important tasks and notes</p>
        
        <div className="auth-buttons">
          <button onClick={openLogin} className="auth-btn login-btn">
            Sign In
          </button>
          <button onClick={openSignup} className="auth-btn signup-btn">
            Sign Up
          </button>
        </div>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <Login 
          isOpen={showLogin} 
          onClose={closeModals}
          switchToSignupModal={openSignup}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* Signup Modal */}
      {showSignup && (
        <Signup 
          isOpen={showSignup} 
          onClose={closeModals}
          switchToLoginModal={openLogin}
        />
      )}
    </div>
  );
};

export default Home;