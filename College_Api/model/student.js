const mongoose = require("mongoose");
const { type } = require("node:os");
const validator = require("validator");
// const { minLength } = require("zod");


const Student = new mongoose.Schema({
    id:{
        type:Number,
        required:true,
        unique: true
    },
    name:{
        type:String,
        required:true,
        minLength:3
    },
    age:{
        type:Number,
        min:18,
        max:30,
    },
    course:{
        type: String,
        enum:["FY MCA", "SY MCA", "FY MBA", "SY MBA"],
        required:true
    },
    email:{
        type:String,
        required:true,
        validate:[validator.isEmail, "Invalid email"]
    }

})

module.exports=mongoose.model("Student",Student);
