require("./instrumentation");
const express = require("express");
const bodyParser = require("body-parser");
const { trace, span, metrics } = require("@opentelemetry/api");

const tracer = trace.getTracer("todo-app-tracer", "1.0.0");
 const meter= metrics.getMeter("todo-app-meter", "1.0.0");

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// In-memory storage for todos
let todos = [];


 const counter= meter.createCounter("todo_requests_total", {
    description: "Total number of todo requests",
 });
// GET all todos
app.get("/todos", (req, res) => {
  return tracer.startActiveSpan("get-all-todos", (span) => {
      span.setAttribute("User-name", "Test-User");
      counter.add(1, { route: "/todos", method: "GET" });
    res.json(todos);
    span.addEvent("Fetched all todos");
  
      try {
        throw ("Test exception");
        
    } catch (error) {
          span.setStatus({ code: 1, message: "Success" });
          span.recordException(error);
      
        
    }
    span.end();
  });
});

// GET single todo by id
app.get("/todos/:id", (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).json({ message: "Todo not found" });
  res.json(todo);
});

// POST new todo
app.post("/todos", (req, res) => {
  const todo = {
    id: todos.length + 1,
    title: req.body.title,
    completed: false,
  };
  todos.push(todo);
  res.status(201).json(todo);
});

// PUT update todo
app.put("/todos/:id", (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).json({ message: "Todo not found" });

  todo.title = req.body.title || todo.title;
  todo.completed = req.body.completed || todo.completed;
  res.json(todo);
});

// DELETE todo
app.delete("/todos/:id", (req, res) => {
  const todoIndex = todos.findIndex((t) => t.id === parseInt(req.params.id));
  if (todoIndex === -1)
    return res.status(404).json({ message: "Todo not found" });

  todos.splice(todoIndex, 1);
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Todo app listening at http://localhost:${port}`);
});
