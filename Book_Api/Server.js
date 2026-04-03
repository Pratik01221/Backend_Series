const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes/route");

const app = express();
const PORT=3000;
app.use(express.json());
app.use(router);

mongoose.connect("mongodb://localhost:27017/bookapi")
.then(()=> console.log("MongoDb is connected"))
.catch((error)=>console.log(error));



app.listen(PORT,()=>{
    console.log("Server running on Port",{PORT});
})