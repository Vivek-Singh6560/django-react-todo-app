// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// This is the base URL for our Django API
const API_BASE = 'http://localhost:8000/api';

function App() {
  // State to hold the list of todos
  const [todos, setTodos] = useState([]);
  // State to hold the input for a new todo title
  const [title, setTitle] = useState('');

  // Function to fetch all todos from the API
  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${API_BASE}/todos/`);
      setTodos(response.data); // Update state with the fetched todos
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  // useEffect hook runs fetchTodos when the component first loads
  useEffect(() => {
    fetchTodos();
  }, []); // The empty array means this effect runs only once on mount

  // Function to create a new todo
  const createTodo = async (e) => {
    e.preventDefault(); // Prevents the form from refreshing the page
    if (!title) return; // Don't create an empty todo

    try {
      await axios.post(`${API_BASE}/todos/`, { title }); // Send POST request
      setTitle(''); // Clear the input field
      fetchTodos(); // Re-fetch the list to show the new todo
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  };

  // Function to toggle the 'completed' status of a todo
  const toggleComplete = async (todo) => {
    try {
      await axios.put(`${API_BASE}/todos/${todo.id}/`, {
        ...todo,
        completed: !todo.completed // Flip the completed status
      });
      fetchTodos(); // Re-fetch the list to see the update
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  // Function to delete a todo
  const deleteTodo = async (todoId) => {
    try {
      await axios.delete(`${API_BASE}/todos/${todoId}/`);
      fetchTodos(); // Re-fetch the list to see the todo gone
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  // The JSX that gets rendered to the screen
  return (
    <div className="App">
      <header className="App-header">
        <h1>My Todo List</h1>
        {/* Form to create a new todo */}
        <form onSubmit={createTodo}>
          <input
            type="text"
            placeholder="Add a new todo..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button type="submit">Add</button>
        </form>

        {/* List of todos */}
        <ul>
          {todos.map(todo => (
            <li key={todo.id} className={todo.completed ? 'completed' : ''}>
              {/* Checkbox to toggle completion status */}
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleComplete(todo)}
              />
              {/* Todo title */}
              <span>{todo.title}</span>
              {/* Button to delete the todo */}
              <button onClick={() => deleteTodo(todo.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;