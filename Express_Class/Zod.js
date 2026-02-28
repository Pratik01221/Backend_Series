// const z = require("zod");
// const express = require("express");
// const app = express();


// const schema = z.array(z.number());

// app.use(express.json());

// app.post("/health-checkup",function(req, res){
    
//      const kidney = req.body.kidney;
//      const response = schema.safeParse(kidney);
//      if (!response.success){
//         return res.status(400).send({error: response.error.message});
//      } else {
//          res.send({response});
//      }
    
// })

// app.listen(3000);



// if this is array of dtring retuns false

// const z  = require("zod");

// const schema = z.array(z.string());

// const response = schema.safeParse(["a","b","c"  ]);

// console.log(response);