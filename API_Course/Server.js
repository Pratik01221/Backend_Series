const express = require("express");
const mongoose = require("mongoose");
const { error } = require("node:console");
const router = require("./routes/routes");
const app = express();
app.use(express.json())
app.use(router);

mongoose.connect("")
.then(()=>console.log("MongoDB is connected"))
.catch((error)=>console.log(error));


app.listen(3000,()=>{
    console.log("Server is Runing on Port 3000");
})

