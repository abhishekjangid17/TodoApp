const express = require("express");
const router = express.Router();
const { getDatabase } = require("./database"); // Use getDatabase() instead of getCollection()
const { ObjectId } = require("mongodb");

// Helper function to get the todos collection
const getCollection = () => {
    const db = getDatabase();
    if (!db) {
        throw new Error("Database connection is not established");
    }
    return db.collection("todos");
};

// GET /todos
router.get("/todos", async (req, res) => {
    try {
        const collection = getCollection();
        const todos = await collection.find({}).toArray();
        res.status(200).json(todos);
    } catch (error) {
        console.error("Error fetching todos:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// POST /todos
router.post("/todos", async (req, res) => {
    try {
        const collection = getCollection();
        let { todo } = req.body;

        todo = JSON.stringify(todo);
        const newTodo = await collection.insertOne({ todo, status: false });

        res.status(201).json({ todo, status: false, _id: newTodo.insertedId });
    } catch (error) {
        console.error("Error adding todo:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// DELETE /todos/:id (Only delete if checked)
router.delete("/todos/:id", async (req, res) => {
  const collection = getCollection();
  const _id = new ObjectId(req.params.id);

  // Find the task first
  const todo = await collection.findOne({ _id });

  // Only delete if status is true (checked)
  if (todo && todo.status === true) {
      const deletedTodo = await collection.deleteOne({ _id });
      return res.status(200).json(deletedTodo);
  }

  res.status(400).json({ message: "Task must be checked before deleting" });
});



// PUT /todos/:id
router.put("/todos/:id", async (req, res) => {
    try {
        const collection = getCollection();
        const _id = new ObjectId(req.params.id);
        const { status } = req.body;

        if (typeof status !== "boolean") {
            return res.status(400).json({ message: "Invalid status" });
        }

        const updatedTodo = await collection.updateOne({ _id }, { $set: { status: !status } });
        res.status(200).json(updatedTodo);
    } catch (error) {
        console.error("Error updating todo:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
