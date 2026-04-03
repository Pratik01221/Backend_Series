const mongoose= require("mongoose");

const Student = new mongoose.Schema({
    id: Number,
    name: String,
    age: Number,
    course: String,
    email: String
})

module.exports = mongoose.model("Student",Student);

