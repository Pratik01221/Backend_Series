const express = require("express");
const jwt = require("jsonwebtoken");
const { createTodo, updateTodo } = require("./types");
const { todo } = require("./db");   // correct import
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

/* CREATE TODO */
app.post("/todo", async function (req, res) {
    try {
        const createPayload = req.body;

        await todo.create({
            title: createPayload.title,
            description: createPayload.description,
            completed: false
        });

        res.json({
            msg: "Todo created successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Server error"
        });
    }
});

/* GET TODOS */
app.get("/todos", async function (req, res) {
    try {
        console.log("this is todos");

        const todos = await todo.find({});

        res.json({
            todos,
        });

    } catch (error) {
        res.status(500).json({
            msg: "Error fetching todos",
        });
    }
});


/* MARK TODO COMPLETED */
app.put("/completed", async function (req, res) {
    try {
        const updatePayload = req.body;
        const parsedPayload = updateTodo.safeParse(updatePayload);

        if (!parsedPayload.success) {
            return res.status(411).json({
                msg: "You sent the wrong inputs",
            });
        }

        await todo.updateOne(
            {
                _id: req.body.id,
            },
            {
                completed: true,
            }
        );

        res.json({
            msg: "Todo marked as completed",
        });

    } catch (error) {
        res.status(500).json({
            msg: "Error updating todo",
        });
    }
});


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
