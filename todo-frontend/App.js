import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

const API_URL = 'http://localhost:3000/todos'; // URL for the backend

export default function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  // Fetch the TODOs from the server
  useEffect(() => {
    axios.get(API_URL).then((response) => {
      setTodos(response.data);
    });
  }, []);

  // Add a new TODO
  const addTodo = () => {
    if (newTodo && newDueDate) {
      axios.post(API_URL, { title: newTodo, dueDate: newDueDate }).then((response) => {
        setTodos([...todos, response.data]);
        setNewTodo('');
        setNewDueDate('');
      });
    }
  };

  // Mark a TODO as completed
  const markCompleted = (id) => {
    const todo = todos.find((t) => t.id === id);
    axios.put(`${API_URL}/${id}`, { ...todo, completed: !todo.completed }).then((response) => {
      setTodos(todos.map((t) => (t.id === id ? response.data : t)));
    });
  };

  // Delete a TODO
  const deleteTodo = (id) => {
    axios.delete(`${API_URL}/${id}`).then(() => {
      setTodos(todos.filter((t) => t.id !== id));
    });
  };

  // Filter TODOs based on search query
  const filteredTodos = todos.filter((todo) =>
    todo.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TODO List</Text>

      {/* Search Bar */}
      <TextInput
        style={styles.input}
        placeholder="Search TODO by Title"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter TODO title"
        value={newTodo}
        onChangeText={setNewTodo}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Due Date (YYYY-MM-DD)"
        value={newDueDate}
        onChangeText={setNewDueDate}
      />
      <Button title="Add TODO" onPress={addTodo} />

      <FlatList
        data={filteredTodos} // Use filtered todos based on the search
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
            <Text style={item.completed ? styles.completed : styles.todoText}>
              {item.title} (Due: {item.dueDate})
            </Text>
            <Button title="Complete" onPress={() => markCompleted(item.id)} />
            <Button title="Delete" onPress={() => deleteTodo(item.id)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  todoItem: { marginBottom: 15, padding: 10, borderWidth: 1, borderRadius: 5 },
  todoText: { fontSize: 18 },
  completed: { fontSize: 18, textDecorationLine: 'line-through' },
});
