var jwt = require('jsonwebtoken');
var jwtConfig = require('../../secrets/jwt_config');

module.exports = function(req, res, next) {
    let token = (req.get('Authorization')).split(' ')[1];
    console.log(`auth/refresh: incoming token ${token.slice(0, 9)} ~ ${token.slice(-9)}`);
    try {
        let decoded = jwt.verify(token, jwtConfig.secret);
        if (!decoded) throw 'InvalidTokenError';
        res.json({
            token: jwt.sign({ // recreate token and send it
                UserID: decoded.UserID,
                UserName: decoded.UserName
            }, jwtConfig.secret, jwtConfig.options)
        });
    } catch(e) {
        if (e == 'InvalidTokenError' || e.name == 'TokenExpiredError' || e.name == 'JsonWebTokenError') {
            res.status(401).send({ message: 'Expired or Invalid Token' });
            console.log('auth/refresh: refresh failure, invalid token');
        } else {
            res.status(500).send({ message: 'Internal Server Error' })
            console.log(e);
        }
    }
};
