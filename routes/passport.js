var LocalStrategy = require("passport-local").Strategy;
var mongoURL = "mongodb://localhost:27017/login";
var kafka = require('./kafka/kafkaClient');

//before authenticate, strategy must be configured
module.exports = function(passport) {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
    },
        function(username, password, done) {
        console.log('in passport');
        kafka.makeRequest('login', {"username": username, "password": password }, function(err, results) {
            console.log('in result');
            console.log(results);
            if (err) {
                console.log('err: ' + err);
                return done(err);
            }
            if (!results) {
                console.log('no result: ');
                return done(null, false);
            }
            console.log('normal');
            return done(null, results);
        });
    }));
};


