// In-memory data (shared across all functions)
let todos = [];
let idCounter = 1;

// Controller to handle GET request (Read)
const getTodos = (req, res) => {
  res.json(todos);
};

// Controller to handle POST request (Create)
const createTodo = (req, res) => {
  const { title, dueDate } = req.body;

  if (!title || !dueDate) {
    return res.status(400).json({ error: 'Title and Due Date are required' });
  }

  const newTodo = {
    id: idCounter++,
    title,
    dueDate,
    completed: false
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
};

// Controller to handle PUT request (Update)
const updateTodo = (req, res) => {
  const { id } = req.params;
  const { title, dueDate, completed } = req.body;

  const todoIndex = todos.findIndex((todo) => todo.id == id);

  if (todoIndex === -1) {
    return res.status(404).json({ error: 'TODO not found' });
  }

  const updatedTodo = {
    ...todos[todoIndex],
    title: title || todos[todoIndex].title,
    dueDate: dueDate || todos[todoIndex].dueDate,
    completed: completed !== undefined ? completed : todos[todoIndex].completed,
  };

  todos[todoIndex] = updatedTodo;
  res.json(updatedTodo);
};

// Controller to handle DELETE request (Delete)
const deleteTodo = (req, res) => {
  const { id } = req.params;

  const todoIndex = todos.findIndex((todo) => todo.id == id);

  if (todoIndex === -1) {
    return res.status(404).json({ error: 'TODO not found' });
  }

  todos = todos.filter((todo) => todo.id != id);
  res.json({ message: `TODO with id ${id} deleted successfully` });
};

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo
};
