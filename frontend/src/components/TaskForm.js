import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import "../styles/TaskForm.css";
import Dialog from "./Dialog";

const TaskForm = ({ task, onClose }) => {
  const [title, setTitle] = useState(task ? task.title : '');
  const [description, setDescription] = useState(task ? task.description : '');
  const [category, setCategory] = useState(task ? task.category : 'work');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const authToken = localStorage.getItem('authToken');
      const config = {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      };

      const data = { title, description, category };
      await axiosInstance.post('/tasks', data, config);
      
      setShowSuccessDialog(true);
    } catch (err) {
      console.error('Error creating task:', err);
    }
  };

  return (
    <div className="task-form-container">
      <button className="close-button" onClick={onClose}>
        ×
      </button>
      <form className="task-form" onSubmit={handleSubmit}>
        <h2>Add New Task</h2>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
        <button type="submit" className="submit-btn">Save Task</button>
      </form>

      {/* Success Dialog */}
      {showSuccessDialog && (
        <Dialog
          message="Task created successfully!"
          onClose={() => {
            setShowSuccessDialog(false);
            onClose();
            navigate('/dashboard');
          }}
        />
      )}
    </div>
  );
};

export default TaskForm;

