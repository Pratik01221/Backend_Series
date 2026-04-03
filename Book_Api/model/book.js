const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
    id: {
        type: Number,
        min: 1,
        max: 2
    },
    title: {
        type: String,
        required: true,
        minlength: 2
    },
    author: {
        type: String
    },
    price: {
        type: Number
    },
    publishedyear: {
        type: Number
    }
});
module.exports = mongoose.model("Book", BookSchema);