var express = require('express');
var router = express.Router();
var oracledb = require('../../db/oracledb');
var jwt = require('jsonwebtoken');
var jwtConfig = require('../../secrets/jwt_config');

router.post('/', function(req, res, next) {
    let token = (req.get('Authorization')).split(' ')[1];
    console.log(`auth/account(post): incoming token ${token.slice(0, 9)} ~ ${token.slice(-9)}`);
    try {
        let decoded = jwt.verify(token, jwtConfig.secret);
        if (!decoded) throw 'InvalidTokenError';
        oracledb.bind("\
        SELECT CustomerID, \
        CustomerName, \
        Gender, \
        Age, \
        ContactNumber, \
        Address, \
        Email \
        FROM Customers \
        WHERE CustomerID = :0", [
            decoded.UserID,
        ], function(err, result) {
            if (err) console.log(err);
            else {
                var row = result.rows[0];
                let obj = {
                    CustomerID: '',
                    CustomerName: '',
                    Gender: '',
                    Age: '',
                    ContactNumber: '',
                    Address: '', 
                    Email: '',
                }
                for (i in obj) obj[i] = row.shift();
                res.json(obj);
            }       
        });
    } catch(e) {
        if (e == 'InvalidTokenError' || e.name == 'TokenExpiredError' || e.name == 'JsonWebTokenError') {
            res.status(401).send({ message: 'Expired or Invalid Token' });
            console.log('auth/account(post): searching for information failed, invalid token');
        } else {
            res.status(500).send({ message: 'Internal Server Error' })
            console.log(e);
        }
    }
});

router.post('/reservation', function(req, res, next) {
    let token = (req.get('Authorization')).split(' ')[1];
    var b = req.body;
    console.log('verify:' + b.from, b.to);
    console.log(`auth/account/reservation(post): incoming token ${token.slice(0, 9)} ~ ${token.slice(-9)}`);
    try {
        let decoded = jwt.verify(token, jwtConfig.secret);
        if (!decoded) throw 'InvalidTokenError';
        oracledb.bind("\
        SELECT ReservationID, \
        TotalPrice, \
        AdultTicketCount, \
        YouthTicketCount, \
        ReservedSeats, \
        TO_CHAR(ReservedDate, 'YYYY-MM-DD'), \
        RoomName, \
        WM_CONCAT(CONCAT(RowNo, ColumnNo)), \
        TO_CHAR(PlayDate, 'YYYY-MM-DD HH24:MI')\
        FROM ( \
            SELECT Q.*, ROWNUM N \
            FROM ( \
                SELECT DISTINCT \
                    rs.ReservationID, \
                    rs.TotalPrice, \
                    rs.AdultTicketCount, \
                    rs.YouthTicketCount, \
                    rs.ReservedSeats, \
                    rs.ReservedDate, \
                    r.RoomName, \
                    s.RowNo, \
                    s.ColumnNo, \
                    sc.PlayDate \
                FROM Reservations rs \
                JOIN Seats s ON rs.ReservationID = s.ReservationID \
                JOIN Rooms r ON s.RoomID = r.RoomID \
                JOIN Schedules sc ON sc.ScheduleID = rs.ScheduleID \
                WHERE rs.CustomerID = :0 \
                ORDER BY rs.ReservedDate DESC \
            ) Q \
        ) \
        GROUP BY ReservationID, TotalPrice, AdultTicketCount, YouthTicketCount, ReservedSeats, ReservedDate, RoomName, PlayDate", [
            decoded.UserID,
        ], function(err, result) {
            if (err) console.log(err);
            else {
                var arr = [];
                var rows = result.rows;
                for (var i in rows) {
                    row = rows[i];
                    let obj = {
                        ReservationID: -1,
                        TotalPrice: '',
                        AdultTicketCount: '',
                        YouthTicketCount: '',
                        ReservedSeats: '',
                        ReservedDate: '', 
                        RoomName: '',
                        Seats: '',
                        PlayDate: ''
                    }
                    for (i in obj) obj[i] = row.shift();
                    arr.push(obj);
                }
                console.log(`auth/account/reservation(post): fetched ${arr.length} row(s)`);
                res.json(arr);
            }
        });
    } catch(e) {
        if (e == 'InvalidTokenError' || e.name == 'TokenExpiredError' || e.name == 'JsonWebTokenError') {
            res.status(401).send({ message: 'Expired or Invalid Token' });
            console.log('auth/account/reservation(post): listing reservations failed, invalid token');
        } else {
            res.status(500).send({ message: 'Internal Server Error' })
            console.log(e);
        }
    }
});

module.exports = router;
