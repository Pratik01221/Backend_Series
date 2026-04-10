const express = require("express");
const router = express.Router();

const Student = require("../model/student");
const ValidateSchema = require("../Validation");

// ADD student
router.post("/addstudent", async (req, res) => {
    const { error } = ValidateSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const student = new Student(req.body);
        await student.save();
        res.status(200).json(student);
    } catch (err) {
        res.status(500).json({ error: "Failed to create student" });
    }
});

// GET all students
router.get("/allstudent", async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (err) {
        res.status(404).json({ error: "Failed to fetch students" });
    }
});

// GET student by ID
router.get("/student/:id", async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        res.status(200).json(student);
    } catch (error) {
        res.status(400).json({ error: "ID not found" });
    }
});

// UPDATE student
router.put("/updatestudent/:id", async (req, res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedStudent) {
            return res.status(404).json({ error: "Student not found" });
        }

        res.status(200).json(updatedStudent);
    } catch (err) {
        res.status(500).json({ error: "Update failed" });
    }
});

// DELETE student
router.delete("/delete/:id", async (req, res) => {
    try {
        const deletedStudent = await Student.findByIdAndDelete(req.params.id);

        if (!deletedStudent) {
            return res.status(404).json({ error: "Student not found" });
        }

        res.status(200).json({ message: "Student deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Delete failed" });
    }
});

module.exports = router;