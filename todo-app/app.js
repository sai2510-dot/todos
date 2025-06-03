const express = require("express");
const path = require("path");
const { Todo } = require("./models");

const app = express();

// Set up EJS as view engine
app.set("view engine", "ejs");

// Serve static files (e.g., CSS)
app.use(express.static(path.join(__dirname, "public")));

// Body parsers
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Utility: get today's date in YYYY-MM-DD
const getTodayDate = () => new Date().toISOString().split("T")[0];

// Home route: renders UI
app.get("/", async (req, res) => {
  try {
    const todos = await Todo.findAll();
    const today = getTodayDate();

    const overdue = todos.filter((todo) => todo.dueDate < today);
    const dueToday = todos.filter((todo) => todo.dueDate === today);
    const dueLater = todos.filter((todo) => todo.dueDate > today);

    res.render("index", {
      overdue,
      dueToday,
      dueLater,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error loading todos");
  }
});

// Create new todo (HTML form)
app.post("/todos", async (req, res) => {
  try {
    await Todo.create({
      title: req.body.title,
      dueDate: getTodayDate(),
      completed: false,
    });
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(422).send("Failed to create todo");
  }
});

// --- API Endpoints (for Postman / automation) ---

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

// Add new todo (JSON)
app.post("/api/todos", async (req, res) => {
  try {
    const todo = await Todo.create({
      title: req.body.title,
      dueDate: req.body.dueDate || getTodayDate(),
      completed: false,
    });
    res.status(201).json(todo);
  } catch (error) {
    console.error(error);
    res.status(422).json({ error: "Failed to create todo" });
  }
});

// Mark as completed
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

// Delete todo
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
