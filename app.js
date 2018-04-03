var express = require('express');
var bodyParser = require('body-parser');
var router = require('./routes/router');
var path = require('path');
var cors = require('cors');
var fileUpload = require('express-fileupload');
var passport = require('passport');
require('./routes/passport')(passport);

var app = express();
var port = 4200;
app.use(cors());
app.use(express.static('assets'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(fileUpload());

app.use('/', router);

app.listen(port, function(){
    console.log('hello world');
});

