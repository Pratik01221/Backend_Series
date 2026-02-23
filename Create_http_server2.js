const express= require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.get("/",function(req,res){
    console.log(req.body)
    
    res.send("Hello World hi i am learning node js");
});


app.listen(PORT,function(){
    console.log(`Server is running on port ${PORT}`);
});