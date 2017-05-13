const express = require('express');
const path = require('path');
const systemModule = require('./system');

var app = express();

app.use(require('body-parser').urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));

app.use('/TasterFaceShop' , systemModule);

var server = app.listen(8081,()=>{
  console.log("it's alive in port 8081!");
});