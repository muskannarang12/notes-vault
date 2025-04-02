const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware'); // Destructure here
const { getTasks, createTask, updateTask, deleteTask } = require('../authControllers/taskController');

const router = express.Router();

router.use(authMiddleware);

router.get('/', getTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;