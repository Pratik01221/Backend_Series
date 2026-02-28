const express = require ("express")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const jwtpassword = "123456"


mongoose.connect("mongodb://localhost:27017/mydatabase")

const user = mongoose.model("User",{
    name: String,
    username: String,
    password: String
})

const app = express()
app.use(express.json())

function userExists(username, password) {
    // check if the user exists in the database
        return user.findOne({ username: username, password: password }).then((user) => {
            if (user) {
                return true;
            } else {
                return false;
            }
        });
}

app.post("/sinin" , async function (req, res) {
    const username = req.body.username
    const password = req.body.password

    // C HECK IF THE USER EXISTS IN THE DATABASE
    const userExistsResult = await userExists(username, password);
    
    if(!userExistsResult){
        return res.status(400).json({ message: "Invalid credentials" });
    }
    
})

app.listen(3000, function () {
    console.log("Server is running on port 3000")
})