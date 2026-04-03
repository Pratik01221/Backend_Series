const express= require("express");
const router =express.Router();
const Student = require("../model/student");
const Studentvalidation= require("../validation");
const { model } = require("mongoose");


// add stusent
router.post("/addstusent",async(req,res)=>{
    const {error}= Studentvalidation(req.body);
    if(error){
        res.status(404).json({message:"Wrong data enterend checjk validations"});
    }

    const student = new Student(req.body);
    await student.save();

    res.status(201).json(student);
})

module.exports=router;