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
            decoded.userID,
        ], function(err, result) {
            if (err) console.log(err);
            else {
                let row = result.rows[0];
                let obj = {
                    CustomerID: '',
                    CustomerName: '',
                    Gender: '',
                    Age: '',
                    ContactNumber: '',
                    Address: '', 
                    Email: '',
                }
                for (let i in obj) obj[i] = row.shift();
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
    let b = req.body;
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
        MovieTitle, \
        CinemaName, \
        RoomName, \
        WM_CONCAT(CONCAT(RowNo, ColumnNo)), \
        TO_CHAR(PlayDate, 'YYYY-MM-DD HH24:MI') \
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
                    m.MovieTitle, \
                    c.CinemaName, \
                    r.RoomName, \
                    s.RowNo, \
                    s.ColumnNo, \
                    sc.PlayDate \
                FROM Reservations rs \
                JOIN Seats s ON rs.ReservationID = s.ReservationID \
                JOIN Rooms r ON s.RoomID = r.RoomID \
                JOIN RoomSchedule r_s ON r_s.RoomID = r.RoomID \
                JOIN Cinemas c ON c.CinemaID = r.CinemaID \
                JOIN Schedules sc ON sc.ScheduleID = rs.ScheduleID \
                JOIN MovieSchedule m_s ON m_s.ScheduleID = sc.ScheduleID \
                JOIN Movies m ON m.MovieID = m_s.MovieID \
                WHERE rs.CustomerID = :0 \
                ORDER BY rs.ReservedDate DESC \
            ) Q \
        ) \
        GROUP BY ReservationID, TotalPrice, AdultTicketCount, YouthTicketCount, ReservedSeats, ReservedDate, MovieTitle, CinemaName, RoomName, PlayDate", [
            decoded.userID,
        ], function(err, result) {
            if (err) console.log(err);
            else {
                let arr = [];
                let rows = result.rows;
                for (let i in rows) {
                    row = rows[i];
                    let obj = {
                        ReservationID: -1,
                        TotalPrice: '',
                        AdultTicketCount: '',
                        YouthTicketCount: '',
                        ReservedSeats: '',
                        ReservedDate: '', 
                        MovieTitle: '',
                        CinemaName: '',
                        RoomName: '',
                        Seats: '',
                        PlayDate: ''
                    }
                    for (let j in obj) obj[j] = row.shift();
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
