var LocalStrategy = require("passport-local").Strategy;

var kafka = require('./kafka/kafkaClient');
//before authenticate, strategy must be configured
module.exports = function(passport) {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
        function(username, password, done) {//done is passport verify callback
        console.log('in passport');
        var content = {
            username: username,
            password: password
        };
        kafka.makeRequest('login', content, function(err, results) {
            console.log('in result');
            if (err) {
                console.log('err: ', err);
                return done(err);
            }
            if (!results) {
                console.log('no result: ');
                return done(null, false);
            }
            console.log('kafka received normal', results);
            if (results._id) {
                return done(null, results);
            } else {
                return done(null, false);
            }
        });
    }));
};


