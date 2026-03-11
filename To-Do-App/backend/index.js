const express = require("express");
const jwt = require("jsonwebtoken");
const { createTodo, updateTodo } = require("./types");  

const app = express();

app.use(express.json());

app.post("/todo ", function(req,res){
    const createPayload = req.body;
    const parsedPayload = createTodo.safeParse(createPayload);
    if (!parsedPayload.success) {
        return res.status(411).json({
            msg: "You sent the wrong inputs",
        })
    }
    return;

})

app.get("/todos",function(req,res){

    console.log("this is todos")
})

app.put("/completed",function(req,res){
    const updatePayload = req.body;
    const parsedPayload = updateTodo.safeParse(updatePayload);
    if (!parsedPayload.success) {
        return res.status(411).json({
            msg: "You sent the wrong inputs",
        })
    }
    return; 
   
})  

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
