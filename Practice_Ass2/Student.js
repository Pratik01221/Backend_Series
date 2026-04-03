const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    age: Number,
    course: String,
    email: String
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;