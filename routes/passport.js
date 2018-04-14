var LocalStrategy = require("passport-local").Strategy;

var kafka = require('./kafka/kafkaClient');
var User = require('../models/user');
//before authenticate, strategy must be configured
module.exports = function(passport) {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
        function(username, password, done) {
        console.log('in passport');
        var content = {
            username: username,
            password: password
        };
        kafka.makeRequest('login', content, function(err, results) {
            console.log('in result');
            if (err) {
                console.log('err: ' + err);
                return done(err);
            }
            if (!results) {
                console.log('no result: ');
                return done(null, false);
            }
            console.log('kafka received normal with username ', results);
            return done(null, results);
        });
    }));
};


