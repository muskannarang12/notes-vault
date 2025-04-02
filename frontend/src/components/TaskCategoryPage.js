import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useParams } from 'react-router-dom';
import "../styles/Dashboard.css";

const TaskCategoryPage = () => {
  const { category } = useParams();
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({ 
    title: '', 
    description: '', 
    category: category || 'work' 
  });
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
        const { data } = await axiosInstance.get('tasks');
        if (category === 'all') {
          setTasks(data);
        } else {
          const filteredTasks = data.filter(task => task.category === category);
          setTasks(filteredTasks);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTasks();
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('tasks', newTask);
      setNewTask({ title: '', description: '', category: category || 'work' });
      setShowForm(false);
      
      const { data } = await axiosInstance.get('tasks');
      if (category === 'all') {
        setTasks(data);
      } else {
        const filteredTasks = data.filter(task => task.category === category);
        setTasks(filteredTasks);
      }
      
      setDialogMessage('Task created successfully!');
      setShowSuccessDialog(true);
    } catch (error) {
      console.error('Error creating task:', error);
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

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedTask = {
        ...taskToEdit,
        title: editFormData.title,
        description: editFormData.description,
        category: editFormData.category,
      };
      await axiosInstance.put(`tasks/${taskToEdit._id}`, updatedTask);
      setTasks(tasks.map(t => t._id === taskToEdit._id ? updatedTask : t));
      setShowEditDialog(false);
      setDialogMessage('Task updated successfully!');
      setShowSuccessDialog(true);
      setSelectedTask(updatedTask);
    } catch (error) {
      console.error('Error updating task:', error);
    }
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
      setSelectedTask(null);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="dashboard-isolated">
      <h1 className="dashboard-title">
        {category === 'all' ? 'All Tasks' : `${category.charAt(0).toUpperCase() + category.slice(1)} Tasks`}
      </h1>

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
            <h2 className="dashboard-form-title">Edit Task</h2>
            <form className="dashboard-task-form" onSubmit={handleEditSubmit}>
              <div className="dashboard-form-group">
                <label className="dashboard-form-label">Task Title</label>
                <input 
                  type="text"
                  className="dashboard-form-input"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                  required
                />
              </div>
              <div className="dashboard-form-group">
                <label className="dashboard-form-label">Task Description</label>
                <textarea
                  className="dashboard-form-textarea"
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                  required
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
                <button type="submit" className="dashboard-btn dashboard-save-btn">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="dashboard-no-tasks">
          {!showForm ? (
            <div className="dashboard-empty-state">
              <p className="dashboard-empty-message">You don't have any {category === 'all' ? '' : category} tasks yet</p>
              <button 
                onClick={() => setShowForm(true)}
                className="dashboard-btn dashboard-primary-btn"
              >
                Create New Task
              </button>
            </div>
          ) : (
            <div className="dashboard-form-container">
              <form className="dashboard-task-form" onSubmit={handleSubmit}>
                <h2 className="dashboard-form-title">Create New Task</h2>
                <div className="dashboard-form-group">
                  <label className="dashboard-form-label">Task Title</label>
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
                  <label className="dashboard-form-label">Task Description</label>
                  <textarea
                    className="dashboard-form-textarea"
                    placeholder="Enter task description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    required
                  />
                </div>
                <div className="dashboard-form-group">
                  <label className="dashboard-form-label">Category</label>
                  <select
                    className="dashboard-form-select"
                    value={newTask.category}
                    onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                  >
                    <option value="work">Work</option>
                    <option value="personal">Personal</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div className="dashboard-form-actions">
                  <button 
                    type="button" 
                    onClick={() => setShowForm(false)}
                    className="dashboard-btn dashboard-cancel-btn"
                  >
                    Cancel
                  </button>
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
              <form className="dashboard-task-form" onSubmit={handleSubmit}>
                <h2 className="dashboard-form-title">Create New Task</h2>
                <div className="dashboard-form-group">
                  <label className="dashboard-form-label">Task Title</label>
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
                  <label className="dashboard-form-label">Task Description</label>
                  <textarea
                    className="dashboard-form-textarea"
                    placeholder="Enter task description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    required
                  />
                </div>
                <div className="dashboard-form-group">
                  <label className="dashboard-form-label">Category</label>
                  <select
                    className="dashboard-form-select"
                    value={newTask.category}
                    onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                  >
                    <option value="work">Work</option>
                    <option value="personal">Personal</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div className="dashboard-form-actions">
                  <button 
                    type="button" 
                    onClick={() => setShowForm(false)}
                    className="dashboard-btn dashboard-cancel-btn"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="dashboard-btn dashboard-save-btn">Save Task</button>
                </div>
              </form>
            </div>
          )}

          <div className="dashboard-task-list">
            <h2 className="dashboard-section-title">
              {category === 'all' ? 'All Tasks' : `${category.charAt(0).toUpperCase() + category.slice(1)} Tasks`}
            </h2>
            <ul className="dashboard-task-items">
              {tasks.map(task => (
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
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          handleEditClick(task);
                        }}
                        className="dashboard-icon-btn"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          handleDeleteClick(task._id); 
                        }}
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

export default TaskCategoryPage;



// when iam clicking edit , edit task form should display as it is being displayed in dashboard. and in form when iam going to edit it is asking me to fill for title , description , category again but i want it only update whatever i want.  suppose i want to update column title then only title should be changed keep other feilds as they were