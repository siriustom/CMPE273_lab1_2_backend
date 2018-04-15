var dbUtil = require('../utils/db');
var kafka = require('../routes/kafka/kafkaClient');

module.exports.postproject = function(req, res) {
    console.log('user has post project');
    var post = req.body;
    var fileName = post.fileName;
    var content = {
        userId: post.userId,
        name: post.name,
        title: post.title,
        fileName: fileName,
        description: post.description,
        skillsRequired: post.skillsRequired,
        budgetRange: post.budgetRange,
        period: post.period,
        averageBid: "",
        bidNumber: "",
        bidNow: ""
    }
    console.log(content);
    var file = req.files.file;
    if(file.mimetype === "application/pdf" ) {
        file.mv('assets/projects/' + fileName, function(err) {
            if (err) return res.status(500).send(err);
            kafka.makeRequest('postproject', content, function (error, results) {
                if (error) {
                    console.log('err: ', error);
                    return res.send("error happened when post project");
                }
                if (!results) {
                    console.log('no result after post project');
                    return res.send('db query return no result');
                }
                console.log('kafka received normal with project ', results);
                return res.send('project has been posted');
            })
        });
    } else {
        var message = "This format is not allowed , please upload file with '.pdf' ";
        return res.send(message);
    }
}

module.exports.getAllProjects = function(req, res) {
    console.log('user has get all projects');
    var today = (new Date()).getTime();
    var sql = "SELECT * FROM project WHERE Period > " + "'" + today + "'";
    dbUtil.fetchAllData(sql, [], function (err, result, fields) {
        if (err) throw err;
        res.json(JSON.stringify(result));
    });
}