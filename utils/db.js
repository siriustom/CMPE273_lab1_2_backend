var mysql = require('mysql');

getConnection = function() {
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '111111',
        database: 'user',
        port: 3306,
    });
    return connection;
}

module.exports.fetchData = function(sql, values, callback) {
    var connection = getConnection();
    connection.query(sql, [values], function(err, rows, fields) {
        if(err) {
            console.log("ERROR: " + err.message);
        } else {
            callback(err, rows[0]);
        }
    });
    connection.end();
}