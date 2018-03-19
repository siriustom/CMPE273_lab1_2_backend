var dbUtil = require('../utils/db');

module.exports.bidOnProject = function(req, res) {
    console.log('user has bid project');
    var sql = "INSERT INTO user_project (userid, projectid, username, bidprice, image, period, projectname, employer) VALUES ?";
    var post = req.body;
    console.log(post);
    var userid = post.userid;
    var projectid = post.projectid;
    var username = post.username;
    var bidprice = post.bidprice;
    var image = post.image;
    var period = post.period;
    var projectname = post.projectname;
    var employer = post.employer;

    var values = [
        [userid, projectid, username, bidprice, image, period, projectname, employer]
    ];
    dbUtil.fetchData(sql, values, function(err, result, fields) {
        if (err) throw err;
        res.send('ok');
    });
}

module.exports.getBidList = function (req, res) {
    console.log('user has get bid list');
    var userid = req.body.userid;
    var sql = "SELECT * FROM user_project WHERE userid = " + "'" + userid + "'";
    dbUtil.fetchAllData(sql, [], function (err, result, fields) {
        if (err) throw err;
        res.json(JSON.stringify(result));
    });
}