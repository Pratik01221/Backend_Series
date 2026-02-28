const express = require("express")
const app = express();



app.get("/health-checkup",function(req, res){
     const username = req.query.username;
     const password = req.query.password;
     const kidneyId = req.query.kidneyId;

     
     if(username === "pratik" && password === "123  "){
        if (kidneyId === "1" || kidneyId === "2"){
            res.send("You are logged in");
        }
        else{
            res.send("You are not logged in");
        }
     }
     else{
         res.send("You are not logged in");
     }
})

app.listen(3000);   