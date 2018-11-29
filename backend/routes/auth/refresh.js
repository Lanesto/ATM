var jwt = require('jsonwebtoken');
var jwtConfig = require('../../secrets/jwt_config');

module.exports = function(req, res, next) {
    // Refresh token before it gets expired
    let token = (req.get('Authorization')).split(' ')[1];
    console.log(`auth/refresh: incoming token ${token.slice(0, 9)} ~ ${token.slice(-9)}`);
    try {
        let decoded = jwt.verify(token, jwtConfig.secret);
        if (!decoded) throw 'InvalidTokenError';
        res.json({
            userID: decoded.userID,
            userName: decoded.userName,
            accessToken: jwt.sign({
                userID: decoded.userID,
                userName: decoded.userName
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
