import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronDown, Plus } from "lucide-react";
import "../styles/Navbar.css";
import axiosInstance from '../api/axiosInstance';
import Signup from "../components/signup";
import Login from "./login";
import ForgotPassword from "./forgotpassword";
import Dialog from "./Dialog";
import TaskForm from "./TaskForm";

const Navbar = () => {
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const navigate = useNavigate();

  // Modal handlers
  const handleSignupModalOpen = () => setIsSignupModalOpen(true);
  const handleSignupModalClose = () => setIsSignupModalOpen(false);
  const handleLoginModalOpen = () => setIsLoginModalOpen(true);
  const handleLoginModalClose = () => setIsLoginModalOpen(false);
  const handleForgotPasswordModalOpen = () => setIsForgotPasswordModalOpen(true);
  const handleForgotPasswordModalClose = () => setIsForgotPasswordModalOpen(false);

  // Task form handler
  const handleAddTaskClick = () => {
    setShowTaskForm(true);
  };

  const handleTaskFormClose = () => {
    setShowTaskForm(false);
  };

  const switchToLoginModal = () => {
    handleSignupModalClose();
    handleLoginModalOpen();
  };
  
  const switchToSignupModal = () => {
    handleLoginModalClose();
    handleSignupModalOpen();
  };
  
  const switchToForgotPasswordModal = () => {
    handleLoginModalClose();
    handleForgotPasswordModalOpen();
  };
  
  const switchToLoginModalFromForgotPassword = () => {
    handleForgotPasswordModalClose();
    handleLoginModalOpen();
  };

  // Task category handlers
  const handleCategorySelect = (category) => {
    if (category === 'all') {
      navigate('/tasks/all');
    } else {
      navigate(`/tasks/${category}`);
    }
    setIsDropdownOpen(false);
  };

  // Auth handlers
  const handleLoginSuccess = (token) => {
    setIsLoggedIn(true);
    handleLoginModalClose();
    localStorage.setItem("token", token);
    setShowLoginDialog(true);
    navigate("/dashboard");
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      await axiosInstance.post("/auth/logout", {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setIsLoggedIn(false);
      localStorage.removeItem("token");
      setShowLogoutDialog(true);
      navigate("/");
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 500) {
        setIsLoggedIn(false);
        localStorage.removeItem("token");
        setShowLogoutDialog(true);
        navigate("/");
      } else {
        console.error("Logout error:", error);
      }
    }
  };

  return (
    <div className="navbar">
      {/* Top Banner */}
      <div className="topBanner">
        Access your Notes From Anywhere ✍️
      </div>

      {/* Main Navbar Content */}
      <nav className="navContent">
        {/* Logo */}
        <div className="logo">
          <a href="/" className="logoCreative">Notes</a>
          <a href="/" className="logoScrap">Vault</a>
        </div>

        {/* Search Bar */}
        <div className="searchContainer">
          <input type="text" placeholder="Search notes..." className="searchInput" />
          <button className="searchButton">
            <Search size={20} color="#6b7280" />
          </button>
        </div>

        {/* Auth Buttons */}
        <div className="authButtons">
          {isLoggedIn ? (
            <div className="logged-in-controls">
              {/* Tasks Dropdown and Add Task Button */}
              <div className="tasks-nav-container">
              <button 
                  className="nav-button primary"
                  onClick={handleAddTaskClick}
                >
                  <Plus size={16} /> Add Task
                </button>
                <div className="tasks-dropdown-container">
               
                  <button 
                    className="nav-button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    Tasks <ChevronDown size={16} />
                  </button>
                  {isDropdownOpen && (
                    <div className="tasks-dropdown-menu">
                      <button onClick={() => handleCategorySelect('all')}>All Tasks</button>
                      <button onClick={() => handleCategorySelect('work')}>Work</button>
                      <button onClick={() => handleCategorySelect('personal')}>Personal</button>
                      <button onClick={() => handleCategorySelect('urgent')}>Urgent</button>
                    </div>
                  )}
                </div>

              
              </div>
              
              {/* Sign Out Button */}
              <button className="joinButton" onClick={handleLogout}>Sign out</button>
            </div>
          ) : (
            <>
              <button className="link" onClick={handleLoginModalOpen}>Sign In</button>
              <button className="joinButton" onClick={handleSignupModalOpen}>Signup</button>
            </>
          )}
        </div>
      </nav>

      {/* Task Form Modal */}
      {showTaskForm && (
        <div className="task-form-modal">
          <TaskForm 
            task={null} 
            onClose={handleTaskFormClose}
          />
        </div>
      )}

      {/* Signup Modal */}
      <Signup
        isOpen={isSignupModalOpen}
        onClose={handleSignupModalClose}
        switchToLoginModal={switchToLoginModal}
      />

      {/* Login Modal */}
      <Login
        isOpen={isLoginModalOpen}
        onClose={handleLoginModalClose}
        switchToSignupModal={switchToSignupModal}
        switchToForgotPassword={switchToForgotPasswordModal}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Forgot Password Modal */}
      <ForgotPassword
        isOpen={isForgotPasswordModalOpen}
        onClose={handleForgotPasswordModalClose}
        switchToLogin={switchToLoginModalFromForgotPassword}
      />

      {/* Success Dialogs */}
      {showLogoutDialog && (
        <Dialog
          message="Logout successful!"
          onClose={() => setShowLogoutDialog(false)}
        />
      )}
      {showLoginDialog && (
        <Dialog
          message="Login successful!"
          onClose={() => setShowLoginDialog(false)}
        />
      )}
    </div>
  );
};

export default Navbar;


// const switchToLoginModal = () => {
//   handleSignupModalClose();
//   handleLoginModalOpen();
// };

// const switchToSignupModal = () => {
//   handleLoginModalClose();
//   handleSignupModalOpen();
// };

// const switchToForgotPasswordModal = () => {
//   handleLoginModalClose();
//   handleForgotPasswordModalOpen();
// };

// const switchToLoginModalFromForgotPassword = () => {
//   handleForgotPasswordModalClose();
//   handleLoginModalOpen();
// };