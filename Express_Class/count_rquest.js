const express = require("express");
const app = express();

let requestCount = 0;

function calculateRequestCount(req, res, next){
    requestCount++;
    console.log(requestCount);
    next();
}       
 

app.get("/counter",calculateRequestCount,function(req, res){
    res.send("You have made " + requestCount + " requests");
})

app.listen(3000);   