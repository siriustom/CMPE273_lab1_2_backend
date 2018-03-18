var express = require('express');
var bodyParser = require('body-parser');
var router = require('./routes/router');
var path = require('path');
var cors = require('cors');
var fileUpload = require('express-fileupload');


var app = express();
var port = 4200;

app.use(express.static('assets'));
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(fileUpload());

app.use('/', router);

app.listen(port, function(){
    console.log('hello world');
});
