const express = require("express");
const mongoose = require("mongoose");
const { error } = require("node:console");
const router = require("./routes/route")

const app=express();
app.use(express.json);
app.use(router);

mongoose.connect("mongodb://localhost:27017/StudentStrore")
.then(()=> console.log("Mongodb is connected"))
.catch((error)=> console.log(error));

app.listen(3000,()=>{
    console.log("Server is runing on 3000")
})