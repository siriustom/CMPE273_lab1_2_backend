var dbUtil = require('../utils/db');
var passport = require('passport');
var User = require('../models/user');

module.exports.auth = function(req, res, next) {
    console.log('user has post login');
    res.json(JSON.stringify({status: 'ok'}));
}

module.exports.addUser = function(req, res) {
    console.log('user has register');
    var id = Math.floor(Math.random() * 1000000);
    var sql = "INSERT INTO account (id, email, password, name, image, phone, about_me, skills) VALUES ?";
    var post = req.body;
    console.log(post);
    var email = post.email;
    var password = post.password;
    var name = post.name;
    var file = req.files.file;
    var phone = post.phone;
    var about = post.about;
    var skills = post.skills;

    var fileName = post.filename;

    if(file.mimetype === "image/jpeg" || file.mimetype === "image/png"|| file.mimetype === "image/gif" ) {
        file.mv('assets/images/' + fileName, function(err) {

            if (err) return res.status(500).send(err);
            // var values = [
            //     [id, email, password, name, fileName, phone, about, skills]
            // ];
            // dbUtil.fetchData(sql, values, function(err, result, fields) {
            //     if (err) throw err;
            //     res.send(fileName);
            // });
            var newUser = new User({
                email: email,
                password: password,
                name: name,
                phone: phone,
                about: about,
                skills: skills,
                fileName: fileName
            });

            User.createUser(newUser, function(err, user) {
                if (err) throw err;
                console.log(user);
            })
        });
    } else {
        var message = "This format is not allowed , please upload file with '.png','.gif','.jpg'";
        res.send(message);
    }
}

module.exports.updateUser = function (req, res) {
    var data = {
        id: '',
        email: '',
        name: '',
        password: '',
        filename: '',
        phone: '',
        about: '',
        skills: ''
    }
    var data = Object.assign({}, data, req.body);
    if (req.files) {
        var file = req.files.file;
        if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/gif") {
            file.mv('assets/images/' + data.filename, function (err) {
                if (err) {
                    return res.status(500).send(err);
                } else {
                    console.log('updated file uploaded.');
                }
            });
        }
    }
    var sql = 'UPDATE account SET email = ?, password = ?, name = ?, image = ?, phone = ?, about_me = ?, skills = ? WHERE id = ?';
    var values = [data.email, data.password, data.name, data.filename, data.phone, data.about, data.skills, data.id];
    dbUtil.updateDate(sql, values, function (err, result) {
        if (err) throw err;
        var success = {status: 'ok'};
        res.json(JSON.stringify(success));
    })
}