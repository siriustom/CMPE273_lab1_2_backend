var express = require('express');
var bodyParser = require('body-parser');
var router = require('./routes/router');
var path = require('path');
var cors = require('cors');
var fileUpload = require('express-fileupload');
var expressSessions = require("express-session");
var passport = require('passport');
require('./routes/passport')(passport);//use local strategy to configure passport
var mongoSessionURL = "mongodb://localhost:27017/sessions";
var mongoStore = require("connect-mongo")(expressSessions);
var LocalStrategy = require("passport-local").Strategy;

var app = express();
var port = 4200;
app.use(express.static('assets'));

var corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
}

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(expressSessions({
    secret: "CMPE273_passport",
    resave: false,
    saveUninitialized: false,
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 6 * 1000,
    store: new mongoStore({
        url: mongoSessionURL
    })
}));
// Initialize Passport and restore authentication state, if any, from the
// session.
// app.use(passport.initialize());
// app.use(passport.session());
app.use(fileUpload());

app.use('/', router);

app.listen(port, function(){
    console.log('express backend is listening');
});

