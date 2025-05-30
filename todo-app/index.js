const express = require("express");
const app = express();
const path = require("path");
const db = require("./models"); // import your Sequelize models

app.use(express.json()); // To parse JSON request bodies

// Set EJS as templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Route to fetch todos from DB and render index page
app.get("/", async (req, res) => {
  try {
    const todos = await db.Todo.findAll({ order: [["dueDate", "ASC"]] });
    res.render("index", { todos });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// API endpoint to create a new todo (POST /todos)
app.post("/todos", async (req, res) => {
  try {
    const { title, dueDate, completed } = req.body;
    const todo = await db.Todo.create({ title, dueDate, completed });
    res.status(201).json(todo);
  } catch (error) {
    res.status(422).json({ error: error.message });
  }
});

// API endpoint to mark a todo as completed (PUT /todos/:id/markASCompleted)
app.put("/todos/:id/markASCompleted", async (req, res) => {
  try {
    const todo = await db.Todo.findByPk(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    todo.completed = true;
    await todo.save();
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API endpoint to fetch all todos in JSON format (GET /todos)
app.get("/todos", async (req, res) => {
  try {
    const todos = await db.Todo.findAll({ order: [["dueDate", "ASC"]] });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API endpoint to delete a todo by ID (DELETE /todos/:id)
app.delete("/todos/:id", async (req, res) => {
  try {
    const todo = await db.Todo.findByPk(req.params.id);
    if (!todo) {
      return res.json(false);
    }
    await todo.destroy();
    res.json(true);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔧 Seed route for debugging (adds one test todo to DB)
app.get("/seed", async (req, res) => {
  try {
    await db.Todo.create({
      title: "Test Task",
      dueDate: "2025-06-01",
      completed: false,
    });
    res.redirect("/");
  } catch (error) {
    console.error("Seeding error:", error);
    res.status(500).send("Failed to seed todo");
  }
});

// Sync database and start server
const PORT = process.env.PORT || 3000;
db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
