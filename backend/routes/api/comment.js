var express = require('express');
var router = express.Router();
var oracledb = require('../../db/oracledb');
var jwt = require('jsonwebtoken');
var jwtConfig = require('../../secrets/jwt_config');

router.get('/', function(req, res, next) {
    // Return comments on specific movie
    var q = req.query;
    // movieID
    // from
    // to
    oracledb.bind("\
        SELECT CommentID, \
        Rate, \
        Content, \
        TO_CHAR(PostDate, 'YYYY-MM-DD'), \
        CustomerID \
        FROM ( \
            SELECT Q.*, ROWNUM N \
            FROM ( \
                SELECT * \
                FROM Comments \
                WHERE MovieID = :0 \
                ORDER BY PostDate DESC \
            ) Q \
        ) \
        WHERE N BETWEEN :1 AND :2", [
        q.movieID,
        parseInt(q.from, 10),
        parseInt(q.to, 10)
    ], function(err, result) {
        if (err) console.log(err);
        else {
            var arr = [];
            var rows = result.rows;
            for (var i in rows) {
                row = rows[i];
                let obj = {
                    CommentID: -1,
                    Rate: '',
                    Content: '',
                    PostDate: '',
                    CustomerID: '',
                }
                for (i in obj) obj[i] = row.shift();
                arr.push(obj);
            }
            console.log(`api/comment(get): fetched ${arr.length} row(s)`);
            res.json(arr);
        }
    });
});

router.post('/', function(req, res, next) {
    // Add new comment on specific movie
    let token = (req.get('Authorization')).split(' ')[1];
    var b = req.body;
    // movieID: where it sticks to
    // rate: evaluated point on movie
    // content: comment itself
    console.log(`api/comment(post): incoming token ${token.slice(0, 9)} ~ ${token.slice(-9)}`);
    try {
        let decoded = jwt.verify(token, jwtConfig.secret);
        if (!decoded) throw 'InvalidTokenError';
        oracledb.bind("\
        INSERT INTO Comments(Rate, Content, PostDate, MovieID, CustomerID) \
        VALUES(:0, :1, SYSDATE, :2, :3)", [
            b.rate,
            b.content,
            b.movieID,
            decoded.UserID
        ], function(err, result) {
            try {
                if (err) {
                    console.log(err);
                    throw 'DatabaseError';
                } else if (result.rowsAffected) {
                    res.status(201).send({ message: 'Commented successfully' });
                } else throw 'DatabaseError';
            } catch(e) {
                if (e == 'DatabaseError') {
                    res.status(500).send({ message: 'Server Database Error' });
                    console.log('api/comment(post): server database error');
                }
            }
        });
    } catch(e) {
        if (e == 'InvalidTokenError' || e.name == 'TokenExpiredError' || e.name == 'JsonWebTokenError') {
            res.status(401).send({ message: 'Expired or Invalid Token' });
            console.log('api/comment(post): adding new comment failed, invalid token');
        } else {
            res.status(500).send({ message: 'Internal Server Error' })
            console.log(e);
        }
    }
});

router.delete('/:id', function(req, res, next) {
    // Delete a comment
    let token = (req.get('Authorization')).split(' ')[1];
    var p = req.params;
    // commentID: the comment to delete
    console.log(`api/comment(delete): incoming token ${token.slice(0, 9)} ~ ${token.slice(-9)}`);
    try {
        let decoded = jwt.verify(token, jwtConfig.secret);
        if (!decoded) throw 'InvalidTokenError';
        oracledb.bind("\
        DELETE FROM Comments \
        WHERE CommentID = :0 AND CustomerID = :1", [
            p.id,
            decoded.UserID
        ], function(err, result) {
            try {
                console.log(`try: ${p.id}, ${decoded.UserID}`)
                if (err) {
                    console.log(err);
                    throw 'DatabaseError';
                } else if (result.rowsAffected) {
                    res.status(200).send({ message: 'Deleted a comment successfully' });
                } else throw 'HaveNoRightsError';
            } catch(e) {
                if (e == 'DatabaseError') {
                    res.status(500).send({ message: 'Server Database Error' });
                    console.log('api/comment(delete): server database error');
                } else if (e == 'HaveNoRightsError') {
                    res.status(401).send({ message: 'You Cannot Delete This Comment' });
                    console.log('api/comment(delete): insufficient right error')
                }
            }
        });
    } catch(e) {
        if (e == 'InvalidTokenError' || e.name == 'TokenExpiredError' || e.name == 'JsonWebTokenError') {
            res.status(401).send({ message: 'Expired or Invalid Token' });
            console.log('api/comment(delete): deleting a comment failed, invalid token');
        } else {
            res.status(500).send({ message: 'Internal Server Error' })
            console.log(e);
        }
    }
});

module.exports = router;
