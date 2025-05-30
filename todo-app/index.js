const express = require("express");
const app = express();
const path = require("path");

// Set EJS as the templating engine
app.set("view engine", "ejs");

// Set the views directory
app.set("views", path.join(__dirname, "views"));

// Serve static files (e.g., styles)
app.use(express.static(path.join(__dirname, "public")));

// ✅ Route to render index page and pass todos
app.get("/", (req, res) => {
  const todos = [
    { title: "Learn EJS", dueDate: "2025-06-01", completed: false },
    { title: "Deploy app", dueDate: "2025-06-02", completed: true }
  ];
  res.render("index", { todos });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Started express server at port ${PORT}`);
});
