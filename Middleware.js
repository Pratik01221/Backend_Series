const express = require('express');
const { futimes } = require('node:fs');
const app = express();

function ticketChecker(req, res, next){
    const ticket = req.query.ticket;

    if (ticket ==='free') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Invalid ticket.' });
    }
}

app.use(ticketChecker);

app.get("/ride1",function(req, res){
    res.send('You rode the frist ride');
});


app.get("/ride2", function(req, res){
    res.send('You rode the second ride');
});

app.get("/ride3", function(req, res){
    res.send('You rode the third ride');
});

app.listen(3000, function (req, res) {
    console.log("Server is running on port 3000");
})



// 0000000000000000000000000000000000000000000000000000000000000000


