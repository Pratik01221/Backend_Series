const express = require('express');
const mongoose = require('mongoose');
const { use } = require('react');
const app = express();
const port = 3000;
useroutes = require('./Routes');

app.use(express.json());
app.use(useroutes); 
mongoose.connect('mongodb://localhost:27017/stusentdatabase' )
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`http://localhost:${port}`);
});

