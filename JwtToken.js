const { ALL } = require('dns');
const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const SECRET = "mysecretkey";

const ALL_USERS = [
    { username: 'user1', password: 'password1', name: 'User One' },
    { username: 'user2', password: 'password2', name: 'User Two' },
    { username: 'user3', password: 'password3', name: 'User Three' }
];

function UserExists(username, password) {
    for (let i = 0; i < ALL_USERS.length; i++) {
        if (
            ALL_USERS[i].username === username &&
            ALL_USERS[i].password === password
        ) {
            return true;
        }
    }
    return false;
}

// test route
app.get("/", (req,res)=>{
    res.send("Server running ✅");
});

app.post("/signin", function (req,res){
    const username = req.body.username;
    const password = req.body.password;

    if (!UserExists(username, password)) {
        return res.status(401).json({
            msg:"Invalid username or password"
        })
    }

    const token = jwt.sign({ username }, SECRET);

    return res.json({
        msg:"Login successful",
        token
    })
})

app.get("/users", function (req, res){
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, SECRET);
    const username = decoded.username;

    // return the user details based on the username
    const user = ALL_USERS.find(u => u.username === username);
    res.json({
        user: user
    })
})

app.listen(3000, ()=>{
    console.log("Server is running on port 3000");
});