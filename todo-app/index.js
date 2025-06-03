const express = require("express");
const app = express();
const path = require("path");
const db = require("./models"); // Sequelize models

app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse form submissions

// Set up EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files from 'public'
app.use(express.static(path.join(__dirname, "public")));

// Homepage: render grouped todos
app.get("/", async (req, res) => {
  try {
    const todos = await db.Todo.findAll({ order: [["dueDate", "ASC"]] });
    const today = new Date().toISOString().split("T")[0];

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
    res.status(500).send("Internal Server Error");
  }
});

// API: Get all todos
app.get("/todos", async (req, res) => {
  try {
    const todos = await db.Todo.findAll({ order: [["dueDate", "ASC"]] });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API: Create a new todo
app.post("/todos", async (req, res) => {
  try {
    const { title, dueDate, completed = false } = req.body;
    const todo = await db.Todo.create({ title, dueDate, completed });
    res.status(201).json(todo);
  } catch (error) {
    res.status(422).json({ error: error.message });
  }
});

// API: Mark as completed
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

// API: Delete todo
app.delete("/todos/:id", async (req, res) => {
  try {
    const todo = await db.Todo.findByPk(req.params.id);
    if (!todo) return res.json(false);
    await todo.destroy();
    res.json(true);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Optional: seed route for testing
app.get("/seed", async (req, res) => {
  try {
    await db.Todo.create({
      title: "Sample Task",
      dueDate: new Date().toISOString().split("T")[0],
      completed: false,
    });
    res.redirect("/");
  } catch (error) {
    console.error("Seed error:", error);
    res.status(500).send("Seeding failed");
  }
});

// Sync DB and start server
const PORT = process.env.PORT || 3000;
db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});
