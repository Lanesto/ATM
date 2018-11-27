var oracledb = require('../../db/oracledb');
var jwt = require('jsonwebtoken');
var jwtConfig = require('../../secrets/jwt_config');

module.exports = function(req, res, next) {
    let b = req.body;
    console.log(`auth/login: incoming request ${b.id}`);
    oracledb.bind("\
        SELECT CustomerID, CustomerName FROM Customers \
        WHERE CustomerID = :0 AND Password = :1", [
        b.id,
        b.password
    ], function(err, result) {
        try {
            if (err) {
                console.log(err);
                throw 'DatabaseError'
            }
            else {
                let rows = result.rows;
                if (rows.length == 1) {
                    let row = rows[0];
                    let obj = {
                        UserID: '',
                        UserName: ''
                    };
                    for (let i in obj) obj[i] = row.shift();
                    res.status(200).json({
                        ...obj,
                        accessToken: jwt.sign(obj, jwtConfig.secret, jwtConfig.options)
                    });
                } else {
                    if (rows.length > 1) throw 'DatabaseError';
                    else // rows.length == 0
                        throw 'InvalidUserError';
                }
            }
        } catch(e) {
            if (e == 'InvalidUserError') {
                res.status(400).send({ message: 'Invalid ID or Password' });
                console.log('auth/login: invalid user information');
            } else if (e == 'DatabaseError') {
                res.status(500).send({ message: 'Server Database Error' });
                console.log('auth/login: server database error');
            } else {
                res.status(500).send({ message: 'Internal Server Error' });
                console.log(e);
            }
        }
    });
};
