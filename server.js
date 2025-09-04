import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Task from "./task.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected on MongoDB");
  } catch (error) {
    console.log("Error to connect to acess the database", error);
  }
};

connectDB();

// CREATE
app.post("/tasks", async (req, res) => {
  const { name, description, color, favorite, startDate } = req.body;

  try {
    const newTask = new Task({
      name: name,
      description: description || "",
      color: color || 0,
      favorite: favorite || false,
      startDate: startDate || new Date(),
      endDate: null,
      complete: false,
    });

    const savedTask = await newTask.save();

    res.status(201).json(savedTask);
    console.log("Task created", savedTask);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
});

// READ ALL

app.get("/tasks", async (req, res) => {
  try {
    let filter = {};

    if (req.query.favorite) {
      filter.favorite = req.query.favorite === "true";
    }

    if (req.query.color) {
      filter.color = parseInt(req.query.color);
    }

    const allTasks = await Task.find(filter).sort({
      favorite: -1,
      complete: 1,
      color: -1,
      startDate: -1,
    });

    res.status(200).json(allTasks);
    console.log("All tasks fetched:", allTasks.length);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// READ ONE

app.get("/tasks/:id", async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json(task);
    console.log("Task found", task);
  } catch (error) {
    console.error("Error fetching task", error);
    res.status(500).json({ error: "Failed to fetch task" });
  }
});

// UPDATE

app.put("/tasks/:id", async (req, res) => {
  try {
    const taskId = req.params.id;
    const updateData = req.body;

    const updatedTask = await Task.findByIdAndUpdate(taskId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json(updatedTask);
    console.log("Task updated", updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Failed to update task" });
  }
});

// DELETE

app.delete("/tasks/:id", async (req, res) => {
  try {
    const taskId = req.params.id;

    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json({ message: "Task found", deletedTask: deletedTask });

    console.log("Task deleted", deletedTask);
  } catch (error) {
    console.error("Error deleting task", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

app.listen(PORT, () => console.log(`The server is running on port ${PORT}`));
