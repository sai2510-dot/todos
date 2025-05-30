const todoList = require("../todo");

describe("Todo List Test Suite", () => {
  beforeEach(() => {
    // Clear todos before each test to avoid interference
    todoList.all().length = 0;
  });

  test("Should add a new todo", () => {
    const todo = {
      title: "Test todo",
      dueDate: new Date().toISOString().split("T")[0],
      completed: false,
    };
    todoList.add(todo);
    expect(todoList.all().length).toBe(1);
  });

  test("Should mark a todo as complete", () => {
    const todo = {
      title: "Test todo",
      dueDate: new Date().toISOString().split("T")[0],
      completed: false,
    };
    todoList.add(todo);
    todoList.markAsComplete(0);
    expect(todoList.all()[0].completed).toBe(true);
  });

  test("Should retrieve overdue items", () => {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0]; // yesterday
    const todo = {
      title: "Overdue todo",
      dueDate: yesterday,
      completed: false,
    };
    todoList.add(todo);
    const overdue = todoList.overdue();
    expect(overdue.length).toBe(1);
    expect(overdue[0].title).toBe("Overdue todo");
  });

  test("Should retrieve due today items", () => {
    const today = new Date().toISOString().split("T")[0];
    const todo = {
      title: "Today todo",
      dueDate: today,
      completed: false,
    };
    todoList.add(todo);
    const dueToday = todoList.dueToday();
    expect(dueToday.length).toBe(1);
    expect(dueToday[0].title).toBe("Today todo");
  });

  test("Should retrieve due later items", () => {
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0]; // tomorrow
    const todo = {
      title: "Due later todo",
      dueDate: tomorrow,
      completed: false,
    };
    todoList.add(todo);
    const dueLater = todoList.dueLater();
    expect(dueLater.length).toBe(1);
    expect(dueLater[0].title).toBe("Due later todo");
  });
});

  