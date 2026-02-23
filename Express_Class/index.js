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
    const johankedny= users[0].kidneys;
    console.log(johankedny);
})


app.listen(3000);
