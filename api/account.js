var dbUtil = require('../utils/db');
var passport = require('passport');
var kafka = require('../routes/kafka/kafkaClient');

module.exports.auth = function(req, res, next) {
    console.log('user has post login');
    res.json(JSON.stringify({status: 'ok'}));
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
                    return res.send("error happened when post project");
                }
                console.log('results from kafka: ', results);
                if (!results) {
                    console.log('no result after post project');
                    return res.send('db query return no result');
                }
                console.log('kafka received normal with project ', results);
                return res.send('project has been posted');
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
