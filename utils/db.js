var mysql = require('mysql');

var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '111111',
    database: 'user'
});

module.exports.fetchData = function(sql, values, callback) {
    // var connection = getConnection();
    pool.getConnection(function (err, connection) {
        if (err) {
            console.log("ERROR: " + err.message);
        } else {
            connection.query(sql, [values], function(err, rows, fields) {
                if(err) {
                    console.log("ERROR: " + err.message);
                } else {
                    callback(err, rows[0]);
                }
            });
        }

    });
}

module.exports.updateDate = function (sql, values, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            console.log("ERROR: " + err.message);
        } else {
            connection.query(sql, values, function(err, rows, fields) {
                if(err) {
                    console.log("ERROR: " + err.message);
                } else {
                    callback(err, rows[0]);
                }
            });
        }
    })
}
