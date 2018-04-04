var dbUtil = require('../utils/db');
var passport = require('passport');

module.exports.auth = function(req, res) {
    console.log('user has post login');
    // var sql = "SELECT * FROM account WHERE email = " + "'" + req.body.email + "'";
    // dbUtil.fetchData(sql, [], function (err, result, fields) {
    //     if (err) throw err;
    //     if (result.password === req.body.password) {
    //         res.json(JSON.stringify(result));
    //     }
    // });
    passport.authenticate('login', function(err, user) {
        if(err) {
            res.status(500).send();
        }

        if(!user) {
            res.status(401).send();
        }
        req.session.user = user.username;
        console.log(req.session.user);
        console.log("session initilized");
        return res.status(201).send({username:"test"});
    })(req, res);
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
            var values = [
                [id, email, password, name, fileName, phone, about, skills]
            ];
            dbUtil.fetchData(sql, values, function(err, result, fields) {
                if (err) throw err;
                res.send(fileName);
            });
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