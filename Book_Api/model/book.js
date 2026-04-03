const mongoose = require("mongoose");
const z = require("zod");
// const { title } = require("node:process");

const BookSchema= new mongoose.Schema({
    id:z.number().min(1).max(2),
    title: z.string().min(2).uniquie().require(),
    author:String,
    price:Number,
    publishedyear:Number
})

module.exports= mongoose("Book",BookSchema);
