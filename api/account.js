var dbUtil = require('../utils/db');


module.exports.auth = function(req, res) {
    console.log('user has post login');
    var sql = "SELECT * FROM account WHERE email = " + "'" + req.body.email + "'";
    dbUtil.fetchData(sql, [], function (err, result, fields) {
        if (err) throw err;
        if (result.password === req.body.password) {
            res.json(JSON.stringify(result));
        }
    });
}

module.exports.addUser = function(req, res) {
    console.log('user has register');
    var id = Math.floor(Math.random() * 1000000);
    var sql = "INSERT INTO account (id, email, password, name, image, phone, about_me, skills) VALUES ?";
    // +
    // "( '" +
    // id + "'" + " , " + "'" + req.body.email + "'" + " , " + "'" + req.body.password + "'" +
    // " , " + "'" + req.body.name + "'" + ")";
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
        file.mv('images/' + fileName, function(err) {
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