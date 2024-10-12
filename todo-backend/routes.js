const express = require('express');
const router = express.Router();

// Import controller functions
const {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo
} = require('./todoController');

// Routes
router.get('/', getTodos); // GET all TODOs
router.post('/', createTodo); // POST a new TODO
router.put('/:id', updateTodo); // PUT (update) a TODO
router.delete('/:id', deleteTodo); // DELETE a TODO

module.exports = router;
