var dbUtil = require('../utils/db');
var passport = require('passport');
var kafka = require('../routes/kafka/kafkaClient');

module.exports.auth = function(req, res, next) {
    console.log('user has post login');
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return next(new Error('no user found'));
        }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.json(JSON.stringify({
                status: 'ok',
                user: user
            }));
        });
    })(req, res, next);
}

module.exports.addUser = function(req, res) {
    console.log('user has register');
    var post = req.body;
    console.log(post);
    var fileName = post.filename;
    var content = {
        email: post.email,
        password: post.password,
        name: post.name,
        phone: post.phone,
        about: post.about,
        skills: post.skills,
        fileName: fileName,
    }
    var file = req.files.file;//uploaded file

    if(file.mimetype === "image/jpeg" || file.mimetype === "image/png"|| file.mimetype === "image/gif" ) {
        file.mv('assets/images/' + fileName, function(err) {
            if (err) return res.status(500).send(err);

            kafka.makeRequest('register', content, function (error, results) {
                if (error) {
                    console.log('err: ', error);
                    return res.send("error happened when register");
                }
                console.log('results from kafka: ', results);
                if (!results) {
                    console.log('no result after register');
                    return res.send('db query return no result');
                }
                console.log('kafka received normal with register ', results);
                return res.send('user has been signed up');
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
    };
    var content = Object.assign({}, data, req.body);
    if (req.files) {
        var file = req.files.file;
        if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/gif") {
            file.mv('assets/images/' + data.filename, function (err) {
                kafka.makeRequest('profileedit', content, function (error, results) {
                    if (error) {
                        console.log('err: ', error);
                        return res.send("error happened when update profile");
                    }
                    console.log('results from kafka: ', results);
                    if (!results) {
                        console.log('no result after update profile');
                        return res.send('db query return no result');
                    }
                    console.log('kafka received normal with profile update ', results);
                    return res.send('profile has been updated');
                })
            });
        } else {
            var message = "This format is not allowed , please upload file with '.png','.gif','.jpg'";
            res.send(message);
        }
    }
    // var sql = 'UPDATE account SET email = ?, password = ?, name = ?, image = ?, phone = ?, about_me = ?, skills = ? WHERE id = ?';
    // var values = [data.email, data.password, data.name, data.filename, data.phone, data.about, data.skills, data.id];
    // dbUtil.updateDate(sql, values, function (err, result) {
    //     if (err) throw err;
    //     var success = {status: 'ok'};
    //     res.json(JSON.stringify(success));
    // })
}
