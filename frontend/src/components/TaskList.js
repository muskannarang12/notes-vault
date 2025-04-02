import React, { useState } from 'react';
import  './TaskItem';
import "../styles/Dashboard.css";

const TaskList = ({ tasks, onDelete, onEdit }) => {
  const [selectedTask, setSelectedTask] = useState(null);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <div key={task._id} onClick={() => handleTaskClick(task)} className="task-list-item">
          <h3>{task.title}</h3>
          <p>{task.category}</p>
        </div>
      ))}
      {selectedTask && (
        <div className="task-detail">
          <h2>{selectedTask.title}</h2>
          <p>{selectedTask.description}</p>
          <p>{selectedTask.category}</p>
          <button onClick={() => onEdit(selectedTask)}>Edit</button>
          <button onClick={() => onDelete(selectedTask._id)}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default TaskList;