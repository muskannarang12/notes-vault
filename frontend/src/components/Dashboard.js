import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ 
    title: '', 
    description: '', 
    category: 'work' 
  });
  const [selectedTask, setSelectedTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    category: 'work'
  });
  const [dialogMessage, setDialogMessage] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const category = params.get('category');
        const url = category && category !== 'all' ? `tasks?category=${category}` : 'tasks';
        
        const { data } = await axiosInstance.get(url);
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTasks();
  }, [window.location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('tasks', newTask);
      setNewTask({ title: '', description: '', category: 'work' });
      setShowForm(false);
      
      const { data } = await axiosInstance.get('tasks');
      setTasks(data);
      
      setDialogMessage('Task created successfully!');
      setShowSuccessDialog(true);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      // Only update fields that have been changed
      const updatedFields = {};
      if (editFormData.title !== taskToEdit.title) updatedFields.title = editFormData.title;
      if (editFormData.description !== taskToEdit.description) updatedFields.description = editFormData.description;
      if (editFormData.category !== taskToEdit.category) updatedFields.category = editFormData.category;

      const updatedTask = {
        ...taskToEdit,
        ...updatedFields
      };
      
      await axiosInstance.put(`tasks/${taskToEdit._id}`, updatedTask);
      setTasks(tasks.map(t => t._id === taskToEdit._id ? updatedTask : t));
      setShowEditDialog(false);
      setDialogMessage('Task updated successfully!');
      setShowSuccessDialog(true);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleEditClick = (task) => {
    setTaskToEdit(task);
    setEditFormData({
      title: task.title,
      description: task.description,
      category: task.category
    });
    setShowEditDialog(true);
  };

  const handleDeleteClick = (taskId) => {
    setTaskToDelete(taskId);
    setDialogMessage('Are you sure you want to delete this task?');
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await axiosInstance.delete(`tasks/${taskToDelete}`);
      setTasks(tasks.filter(task => task._id !== taskToDelete));
      setShowDeleteDialog(false);
      setDialogMessage('Task deleted successfully!');
      setShowSuccessDialog(true);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const recentTasks = tasks.slice(-3).reverse();

  return (
    <div className="dashboard-isolated">
      <h1 className="dashboard-title">Task Manager</h1>

      {/* Success Dialog */}
      {showSuccessDialog && (
        <div className="dashboard-dialog-overlay">
          <div className="dashboard-dialog-box dashboard-success-dialog">
            <p className="dashboard-dialog-message">{dialogMessage}</p>
            <button 
              onClick={() => setShowSuccessDialog(false)}
              className="dashboard-dialog-btn dashboard-dialog-ok-btn"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      {showDeleteDialog && (
        <div className="dashboard-dialog-overlay">
          <div className="dashboard-dialog-box dashboard-delete-dialog">
            <p className="dashboard-dialog-message">{dialogMessage}</p>
            <div className="dashboard-dialog-actions">
              <button 
                onClick={() => setShowDeleteDialog(false)}
                className="dashboard-dialog-btn dashboard-dialog-cancel-btn"
              >
                No
              </button>
              <button 
                onClick={confirmDelete}
                className="dashboard-dialog-btn dashboard-dialog-confirm-btn"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      {showEditDialog && (
        <div className="dashboard-dialog-overlay">
          <div className="dashboard-dialog-box dashboard-edit-dialog">
            <div className="dashboard-form-header">
              <h2 className="dashboard-form-title">Edit Task</h2>
              <button 
                className="dashboard-close-btn"
                onClick={() => setShowEditDialog(false)}
              >
                &times;
              </button>
            </div>
            <form className="dashboard-task-form" onSubmit={handleEditSubmit}>
              <div className="dashboard-form-group">
                <label className="dashboard-form-label">Task Title</label>
                <input 
                  type="text"
                  className="dashboard-form-input"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                />
              </div>
              <div className="dashboard-form-group">
                <label className="dashboard-form-label">Description</label>
                <textarea
                  className="dashboard-form-textarea"
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                />
              </div>
              <div className="dashboard-form-group">
                <label className="dashboard-form-label">Category</label>
                <select
                  className="dashboard-form-select"
                  value={editFormData.category}
                  onChange={(e) => setEditFormData({...editFormData, category: e.target.value})}
                >
                  <option value="work">Work</option>
                  <option value="personal">Personal</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div className="dashboard-form-actions">
                <button 
                  type="button" 
                  onClick={() => setShowEditDialog(false)}
                  className="dashboard-btn dashboard-cancel-btn"
                >
                  Cancel
                </button>
                <button type="submit" className="dashboard-btn dashboard-save-btn">Update Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="dashboard-no-tasks">
          {!showForm ? (
            <div className="dashboard-empty-state">
              <p className="dashboard-empty-message">You don't have any tasks yet</p>
              <button 
                onClick={() => setShowForm(true)}
                className="dashboard-btn dashboard-primary-btn"
              >
                Add Your First Task
              </button>
            </div>
          ) : (
            <div className="dashboard-form-container">
              <div className="dashboard-form-header">
                <h2 className="dashboard-form-title">Add New Task</h2>
                <button 
                  className="dashboard-close-btn"
                  onClick={() => setShowForm(false)}
                >
                  &times;
                </button>
              </div>
              <form className="dashboard-task-form" onSubmit={handleSubmit}>
                <div className="dashboard-form-group">
                  <label className="dashboard-form-label">Task Title *</label>
                  <input 
                    type="text"
                    className="dashboard-form-input"
                    placeholder="Enter task title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    required
                  />
                </div>
                <div className="dashboard-form-group">
                  <label className="dashboard-form-label">Description</label>
                  <textarea
                    className="dashboard-form-textarea"
                    placeholder="Enter task description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  />
                </div>
                <div className="dashboard-form-group">
                  <label className="dashboard-form-label">Category *</label>
                  <select
                    className="dashboard-form-select"
                    value={newTask.category}
                    onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                    required
                  >
                    <option value="work">Work</option>
                    <option value="personal">Personal</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div className="dashboard-form-actions">
                  <button type="submit" className="dashboard-btn dashboard-save-btn">Save Task</button>
                </div>
              </form>
            </div>
          )}
        </div>
      ) : (
        <>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="dashboard-btn dashboard-primary-btn"
          >
            {showForm ? 'Cancel' : 'Add New Task'}
          </button>

          {showForm && (
            <div className="dashboard-form-container">
              <div className="dashboard-form-header">
                <h2 className="dashboard-form-title">Add New Task</h2>
                {/* <button 
                  className="dashboard-close-btn"
                  onClick={() => setShowForm(false)}
                >
                  &times;
                </button> */}
              </div>
              <form className="dashboard-task-form" onSubmit={handleSubmit}>
                <div className="dashboard-form-group">
                  <label className="dashboard-form-label">Task Title *</label>
                  <input 
                    type="text"
                    className="dashboard-form-input"
                    placeholder="Enter task title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    required
                  />
                </div>
                <div className="dashboard-form-group">
                  <label className="dashboard-form-label">Description</label>
                  <textarea
                    className="dashboard-form-textarea"
                    placeholder="Enter task description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  />
                </div>
                <div className="dashboard-form-group">
                  <label className="dashboard-form-label">Category *</label>
                  <select
                    className="dashboard-form-select"
                    value={newTask.category}
                    onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                    required
                  >
                    <option value="work">Work</option>
                    <option value="personal">Personal</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div className="dashboard-form-actions">
                  <button type="submit" className="dashboard-btn dashboard-save-btn">Save Task</button>
                </div>
              </form>
            </div>
          )}

          <div className="dashboard-task-list">
            <h2 className="dashboard-section-title">Recent Tasks</h2>
            <ul className="dashboard-task-items">
              {recentTasks.map(task => (
                <li
                  key={task._id}
                  className="dashboard-task-item"
                  onClick={() => setSelectedTask(task)}
                >
                  <div className="dashboard-task-info">
                    <h3 className="dashboard-task-title">{task.title} - {task.category}</h3>
                  </div>
                  {(!selectedTask || selectedTask._id !== task._id) && (
                    <div className="dashboard-task-actions">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleEditClick(task); }}
                        className="dashboard-icon-btn"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteClick(task._id); }}
                        className="dashboard-icon-btn"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                  {selectedTask && selectedTask._id === task._id && (
                    <div className="dashboard-task-detail">
                      <p className="dashboard-task-description">{task.description}</p>
                      <button 
                        onClick={() => handleEditClick(task)}
                        className="dashboard-btn dashboard-edit-btn"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(task._id)}
                        className="dashboard-btn dashboard-delete-btn"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;