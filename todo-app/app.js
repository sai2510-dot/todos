const express = require("express");
const app = express();
const { Todo } = require("./models");

// Set up EJS as view engine
app.set("view engine", "ejs");

// Serve static files from 'public' folder (for CSS, JS, images)
app.use(express.static("public"));

// Parse URL-encoded bodies (for form submissions)
app.use(express.urlencoded({ extended: false }));

// Parse JSON bodies (for API requests)
app.use(express.json());

// Render index page with todos
app.get("/", async (req, res) => {
  try {
    const todos = await Todo.findAll();
    res.render("index", { todos });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error loading todos");
  }
});

// --- API routes ---

// Get all todos (JSON)
app.get("/todos", async (_req, res) => {
  try {
    const todos = await Todo.findAll();
    res.json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

// Get todo by ID
app.get("/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findByPk(req.params.id);
    if (todo) {
      res.json(todo);
    } else {
      res.status(404).json({ error: "Todo not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(422).json({ error: "Invalid todo ID" });
  }
});

// Add new todo (from JSON body)
app.post("/todos", async (req, res) => {
  try {
    const todo = await Todo.addTodo(req.body);
    res.status(201).json(todo);
  } catch (error) {
    console.error(error);
    res.status(422).json({ error: "Failed to create todo" });
  }
});

// Mark todo as completed
app.put("/todos/:id/markAsCompleted", async (req, res) => {
  try {
    const todo = await Todo.findByPk(req.params.id);
    if (todo) {
      const updatedTodo = await todo.markAsCompleted();
      res.json(updatedTodo);
    } else {
      res.status(404).json({ error: "Todo not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(422).json({ error: "Failed to mark todo as completed" });
  }
});

// Delete todo by ID
app.delete("/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findByPk(req.params.id);
    if (todo) {
      await todo.destroy();
      res.json(true);
    } else {
      res.json(false);
    }
  } catch (error) {
    console.error(error);
    res.status(422).json(false);
  }
});

module.exports = app;
