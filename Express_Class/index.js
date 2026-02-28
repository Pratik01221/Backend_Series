// // creating http server
// //express
// // node default libarray


// const express = require("express")

// const app = express();


// app.get("/", function(req, res){
//     console.log("hell")
// })

// app.listen(3000);

const express = require("express")

const app =  express();


const users=[{
    name:"jon",
    kidneys:[{
        healthy:false
    }]
}]

app.get("/",function(req, res){
    const kidneys = users[0].kidneys;
    const healthyKidneys = kidneys.filter(k => k.healthy);
    
    res.json({
        totalKidneys: kidneys.length,
        healthyKidneys: healthyKidneys.length,
        unhealthyKidneys: kidneys.length - healthyKidneys.length
    });
})


app.post("/",function(req, res){
    const ishealthy = res.body.ishealthy;
    users[0].kidneys.push({healthy:ishealthy});
    res.json(users[0].kidneys); 
})  

app.listen(3000);