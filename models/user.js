var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

mongoose.connect("mongodb://localhost/users");

var db = mongoose.connection;

var UserSchema = mongoose.Schema({
    name: {
        type: String,
        index: true
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    phone: {
        type: String
    },
    about: {
        type: String
    },
    skills: {
        type: String
    },
    filename: {
        type: String
    }
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.getUserByUsername = function (username, callback) {
    var query = {email: username};
    User.findOne(query, callback);
}

module.exports.getUserById = function (id, callback) {
    User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePass, hash, callback) {
    console.log('compare password');
    bcrypt.compare(candidatePass, hash, function(err, isMatch) {
        if (err) throw err;
        callback(null, isMatch);
    });
}