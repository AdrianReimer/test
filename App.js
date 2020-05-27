const express = require('express');
var app = express()

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// assets folder
app.use('/assets', express.static('assets'))

// requests handling
app.get('/',function(req, res){
    res.sendFile(__dirname+"/templates/spectral.html")
})

// set port listener
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
