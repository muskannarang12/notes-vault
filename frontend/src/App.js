import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";  
import Navbar from "./components/Navbar"; 
import ResetPassword from "./components/resetpassword";
import Login from "./components/login"; 
import Signup from "./components/signup"; 
import TaskForm from './components/TaskForm';
import Dashboard from './components/Dashboard';
import TaskCategoryPage from './components/TaskCategoryPage';
import ForgotPassword from "./components/forgotpassword";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <Navbar/>
      <div className="pt-32">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/tasks/:category" element={<TaskCategoryPage />} />
          {/* Add your other routes here */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;