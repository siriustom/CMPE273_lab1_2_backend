var dbUtil = require('../utils/db');

module.exports.postproject = function(req, res) {
    console.log('user has post project');
    var id = Math.floor(Math.random() * 1000000);
    var sql = "INSERT INTO project (id, UserId, Name, Description, SkillsRequired, Employer, " +
        "BudgetRange, File) VALUES ?";
    var post = req.body;
    console.log(post);
    var userId = post.userId;
    var name = post.name;
    var file = req.files.file;
    var title = post.title;
    var des = post.des;
    var skillReq = post.skillReq;
    var budget = post.budget;

    var fileName = post.filename;

    if(file.mimetype === "application/pdf" ) {
        file.mv('assets/projects/' + fileName, function(err) {
            if (err) return res.status(500).send(err);
            var values = [
                [id, userId, title, des, skillReq, name, budget, fileName]
            ];
            dbUtil.fetchData(sql, values, function(err, result, fields) {
                if (err) throw err;
                res.send(fileName);
            });
        });
    } else {
        var message = "This format is not allowed , please upload file with '.pdf' ";
        res.send(message);
    }
}