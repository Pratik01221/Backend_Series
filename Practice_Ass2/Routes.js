const express = require('express');
const router = express.Router();
const Student = require('./Student');

// Create a new student
router.post("/addstudents", async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        res.status(201).send(student);
    } catch (error) {
        res.status(400).send(error);

    }
});

// all students


router.get("/allstudents", async (req, res) => {
    try {
        const students = await Student.find();

        const studentInfo = students.map(student => ({
            name: student.name,
            course: student.course,
            _id: student._id
        }));

        return res.status(200).json(studentInfo); // ✅ only ONE response

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

router.get("/students/:id", async (req, res) =>{
    // const student = await Student.findById(req.params.id);
    const student = await Student.findOne({ id: req.params.id });
    if (!student){
        res.status(404).json({ message:"Student not found" });
    }
    res.status(202).send(student);
})

router.put("/students/:id", async (req, res) =>{
    const student = await Student.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!student){
        res.status(404).json({ message:"Student not found" });
    }
    res.status(202).send(student);
})

router.delete("/students/:id", async (req, res)=>{
    const student = await Student.findOneAndDelete({ id: req.params.id});
    if (!student){
        res.status(404).json({ message:"Student not found" });
    }

    res.status(202).json({ message:"Student deleted successfully" });
})

module.exports = router;

 