const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://admin:[EMAIL_ADDRESS]/")    

const todoSchema = mongoose.Schema({
    title: String,
    description: String,
    completed: Boolean,
})

const todo = mongoose.model("todos", todoSchema);

module.exports = todo;
