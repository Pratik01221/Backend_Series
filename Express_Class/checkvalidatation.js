const z = require("zod");
const express = require("express");
const app = express();

app.use(express.json());

const schema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
});

app.post("/signup",function(req, res){
    
     const user = req.body;
     const response = schema.safeParse(user);
     if (!response.success){
        return res.status(400).send({error: response.error.message});
     } else {
         res.send({responseff});
     }
    
})

app.listen(3000);