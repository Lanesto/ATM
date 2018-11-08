var orcldb = require('oracledb');
var config = require('../secrets/db_config').remote;

orcldb.autoCommit = true;
function run(sql, callback) {
    orcldb.getConnection({
        user: config.user,
        password: config.password,
        connectString: config.connectString
    }, function (err, connection) {
        if (err) {
            console.error(err.message);
            return;
        }
        connection.execute(sql, function(err, result) {
            release(connection);
            if (err) {
                console.error(err.message);
                return;
            }
            callback(result);
        });
    });
}

function bind(sql, data, callback) {
    orcldb.getConnection({
        user: config.user,
        password: config.password,
        connectString: config.connectString
    }, function (err, connection) {
        if (err) {
            console.error(err.message);
            return;
        }
        connection.execute(sql, data, function(err, result) {
            release(connection);
            if (err) {
                console.error(err.message);
                return;
            }
            callback(result);
        });
    });
}

function release(connection) {
    connection.release(function(err) {
        if (err) console.error(err.message);
    });
}

exports.run = run;
exports.release = release;
