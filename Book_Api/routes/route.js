const express = require("express");
const router = express.Router();
const Book = require("../model/book");
const { error } = require("node:console");



// add books

router.post("/addbook",async(req,res)=>{
    try {
        const book= Book(req.body);
        await Book.save();
        res.status(201).send(book);
    } catch (error) {
        res.status(400).send(error);
    }
})



router.get("/getbooks",(req,res)=>{
    try {
        const book = Book.find();
        res.status(201).send(book);
    } catch (error) {
        res.status(400).json({message:error.message})
    }
})

//find by id

router.get("/getbook/:id",(req,res)=>{
    const book = Book.findOne({id:req.params.id});
    if(!book){
        res.status(404).json({message:"user is does not exist"})
    } 
    res.status(202).send(book);
})

//update

router.put("/book:id",(req,res)=>{
    const book = Book.findOneAndUpdate({id:req.params.id});
    if(!book){
        res.status(404).json({message:"book is not found"})
    } 
    res.status(200).json({message:"Successfully Update book"})
})

//
router.delete("/delete/:id",(req,res)=>{
    const book = Book.findOneAndDelete({id:req.params.id})
    if(!book){
        res.status(404).send(error);
    }
    res.status(201).json({message:"Delete Book succesfully "})
})


module.exports=router;