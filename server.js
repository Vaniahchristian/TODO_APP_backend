const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Todo = require('./models/Todo');

const app = express();

// CORS configuration to allow requests from your frontend URL
app.use(cors({
    origin: 'https://group-bse24-x-todoapp-2-frontend.onrender.com',  // Your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,  // Allow credentials (optional, remove if not needed)
}));

app.use(express.json());

// Connect to your MongoDB database (replace with your database URL)
mongoose.connect("mongodb+srv://admin:0754092850@todoapp.aqby3.mongodb.net/")
    .then(() => console.log("MongoDB connected"))
    .catch((error) => console.error("MongoDB connection error:", error));

// Check for database connection errors
mongoose.connection.on("error", (error) => {
    console.error("MongoDB connection error:", error);
});

// Get saved tasks from the database
app.get("/getTodoList", (req, res) => {
    Todo.find({})
        .then((todoList) => res.status(200).json(todoList))
        .catch((err) => res.status(500).json({ message: "Error retrieving todo list", error: err }));
});

// Add new task to the database
app.post("/addTodoList", (req, res) => {
    const { task, status, deadline } = req.body;  // Destructure request body
    Todo.create({ task, status, deadline })
        .then((todo) => res.status(201).json(todo))
        .catch((err) => res.status(500).json({ message: "Error adding todo", error: err }));
});

// Update task fields (including deadline)
app.put("/updateTodoList/:id", (req, res) => {
    const id = req.params.id;
    const updateData = req.body;  // Use the entire request body to update
    Todo.findByIdAndUpdate(id, updateData, { new: true }) // Add { new: true } to return the updated document
        .then((todo) => {
            if (!todo) return res.status(404).json({ message: "Todo not found" });
            res.status(200).json(todo);
        })
        .catch((err) => res.status(500).json({ message: "Error updating todo", error: err }));
});

// Delete task from the database
app.delete("/deleteTodoList/:id", (req, res) => {
    const id = req.params.id;
    Todo.findByIdAndDelete(id)
        .then((todo) => {
            if (!todo) return res.status(404).json({ message: "Todo not found" });
            res.status(200).json({ message: "Todo deleted successfully", todo });
        })
        .catch((err) => res.status(500).json({ message: "Error deleting todo", error: err }));
});

// Set up the server to listen on the specified port
const PORT = process.env.PORT || 3001;  // Use PORT from environment variables or default to 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
