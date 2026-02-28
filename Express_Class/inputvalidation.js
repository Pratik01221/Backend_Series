const express = require("express");
const app = express();

app.use(express.json());

app.post("/health-checkup",function(req, res){
    
    const kidney = req.body.kidney;
    const kidneyLength = kidney.length  ;    

    res.send("you have " +  kidneyLength + "   kidneys");
    
    
})  

app.listen(3000);   