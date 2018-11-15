var oracledb = require('../../db/oracledb');
var jwt = require('jsonwebtoken');
var jwtConfig = require('../../secrets/jwt_config');

module.exports = function(req, res, next) {
    var b = req.body;
    console.log(`auth/login: incoming request ${b.id}`);
    oracledb.bind("\
        SELECT CustomerID, CustomerName FROM Customers \
        WHERE CustomerID = :0 AND Password = :1", [
        b.id,
        b.password
    ], function(err, result) {
        if (err) console.log(err);
        else {
            var rows = result.rows
            if (rows.length == 1) {
                var row = rows[0]
                let obj = {
                    UserID: '',
                    UserName: ''
                }
                for (i in obj) obj[i] = row.shift();
                res.status(200).json({
                    token: jwt.sign(obj, jwtConfig.secret, jwtConfig.options)
                });
            } else {
                console.log(`auth/login: failure(${rows.length})`);
                if (rows.length > 1)
                    res.status(500).send({ message: 'Internal Server Error' });
                else // rows.length == 0
                    res.status(400).send({ message: 'Invalid ID or Password' });
            }
        }
    });
};
