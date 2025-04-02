const express = require("express");
const { 
  signup, 
  login,  
  logout, 
  verifyEmail, 
  forgotPassword, 
  resetPassword 
} = require("../authControllers/authController");
const { authMiddleware, addToBlacklist } = require("../middleware/authMiddleware"); // Import addToBlacklist

const router = express.Router();

// Public routes
router.post("/signup", signup);
router.post("/login", login);
router.get("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Protected route (requires valid token)
router.post('/logout', authMiddleware, async (req, res) => {
  try {
    // Add the token to blacklist using the imported function
    addToBlacklist(req.token);
    
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Logout failed' });
  }
});

module.exports = router;