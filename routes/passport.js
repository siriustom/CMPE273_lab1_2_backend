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
            console.log('kafka received normal with username ' + username);
            User.getUserByUsername(username, function (err, user) {
                if (err) throw err;
                if (!user) {
                    return done(null, false, {message: 'Unknown user'});
                }
                User.comparePassword(password, user.password, function (err, isMatch) {
                    if (err) throw err;
                    if (isMatch) {
                        console.log('ismatch');
                        return done(null, user);
                    } else {
                        console.log('isnotmatch');
                        return done(null, false, {message: 'Invalid password'});
                    }
                })
            });
        });
    }));
    // passport.use(new LocalStrategy({
    //         usernameField: 'email',
    //         passwordField: 'password'
    //     }, function(username, password, done) {
    //         User.getUserByUsername(username, function (err, user) {
    //             if (err) throw err;
    //             if (!user) {
    //                 return done(null, false, {message: 'Unknown user'});
    //             }
    //             User.comparePassword(password, user.password, function (err, isMatch) {
    //                 if (err) throw err;
    //                 if (isMatch) {
    //                     return done(null, user);
    //                 } else {
    //                     return done(null, false, {message: 'Invalid password'});
    //                 }
    //             })
    //         })
    //     }
    // ));

};


