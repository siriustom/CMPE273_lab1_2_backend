var express = require('express');
var bodyParser = require('body-parser');
var router = require('./routes/router');
var path = require('path');
var cors = require('cors');
var fileUpload = require('express-fileupload');
var expressSessions = require("express-session");
var mongoSessionURL = "mongodb://admin:cmpe273@ds241059.mlab.com:41059/sirius";
var mongoStore = require("connect-mongo")(expressSessions);
var User = require('./models/user');
var passport = require('passport');
require('./routes/passport')(passport);

var app = express();
var port = 4200;
app.use(express.static('assets'));

var corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true
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
app.use(passport.initialize());
app.use(passport.session());
app.use(fileUpload());


passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});

app.use('/', router);

app.listen(port, function() {
    console.log('express backend is listening');
});

