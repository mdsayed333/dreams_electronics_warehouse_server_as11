const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());


app.get('/', (req, res) => {
    res.send('Dreams server is running...');
});

app.listen(port, ()=>{
    console.log("Dreams Server Port: ", port);
});