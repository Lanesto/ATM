var express = require('express');
var router = express.Router();
var oracledb = require('../../db/oracledb');
var jwt = require('jsonwebtoken');
var jwtConfig = require('../../secrets/jwt_config');

router.get('/', function(req, res, next) {
    // Return available schedules
    let q = req.query;
    // movieID
    // cinemaID
    // date Format(YYYY-MM-DD)
    oracledb.bind("\
    SELECT sc.ScheduleID, \
    r.RoomID, \
    r.RoomName, \
    r.RowMax, \
    r.ColumnMax, \
    TO_CHAR(sc.PlayDate, 'HH24:MI'), \
    sc.Price, \
    sc.YouthPrice, \
    WM_CONCAT(CONCAT(st.RowNo, st.ColumnNo)) \
    FROM Schedules sc \
    JOIN MovieSchedule m_s ON sc.ScheduleID = m_s.ScheduleID \
    JOIN Movies m ON m.MovieID = m_s.MovieID \
    JOIN RoomSchedule r_s ON sc.ScheduleID = r_s.ScheduleID \
    JOIN Rooms r ON r.RoomID = r_s.RoomID \
    LEFT JOIN Seats st ON sc.ScheduleID = st.ScheduleID \
    WHERE m.MovieID = :0 AND r.CinemaID = :1 AND TO_CHAR(sc.PlayDate, 'YYYY-MM-DD') = :2 \
    GROUP BY sc.ScheduleID, r.RoomID, r.RoomName, r.RowMax, r.ColumnMax, sc.PlayDate, sc.Price, sc.YouthPrice", [
        q.movieID,
        q.cinemaID,
        q.date
    ], function(err, result) {
        if (err) console.log(err);
        else {
            let arr = [];
            let rows = result.rows;
            for (let i in rows) {
                row = rows[i];
                let obj = {
                    ScheduleID: -1,
                    RoomID: -1,
                    RoomName: '',
                    RowMax: 0,
                    ColumnMax: 0,
                    PlayDate: '',
                    Price: '',
                    YouthPrice: '',
                    SeatsUnavailable: ''
                };
                for (let j in obj) obj[j] = row.shift();
                arr.push(obj);
            }
            console.log(`api/reservate(get): fetched ${arr.length} row(s)`);
            res.json(arr);
        }
    });
});

router.post('/', function(req, res, next) {
    let token = (req.get('Authorization')).split(' ')[1];
    let b = req.body;
    // cinemaID
    // roomID
    // scheduleID
    // youthNum
    // selectedSeats [(rowNo, columnNo), ...]
    console.log(`api/reservate(post): incoming token ${token.slice(0, 9)} ~ ${token.slice(-9)}`);
    try {
        let decoded = jwt.verify(token, jwtConfig.secret);
        if (!decoded) throw 'InvalidTokenError';
        let seats_info = '';
        for (let i in b.selectedSeats) {
            let seat = b.selectedSeats[i];
            seats_info += `
                seats_info(${i})('RowNo') := '${seat.rowNo}';
                seats_info(${i})('ColumnNo') := '${seat.columnNo}';`
        }
        oracledb.bind("\
        DECLARE \
            seats_info CUSTOM_PKG.SEATS_CONTAINER; \
        BEGIN" +
            seats_info
        +   "CUSTOM_PKG.NEW_RESERVATION_PRC(:0, :1, :2, :3, :4, seats_info); \
        END;", [
            decoded.UserID,
            b.cinemaID,
            b.roomID,
            b.scheduleID,
            b.youthNum
        ], function(err, result) {
            try {
                if (err) {
                    console.log(err);
                    throw 'DatabaseError';
                } else {
                    res.status(201).send({ message: 'Reservated Successfully' });
                }
            } catch(e) {
                if (e == 'DatabaseError') {
                    res.status(500).send({ message: 'Invalid Reservation Request' });
                    console.log('api/reservate(post): invalid reservation request');
                }
            }
        });
    } catch(e) {
        if (e == 'InvalidTokenError' || e.name == 'TokenExpiredError' || e.name == 'JsonWebTokenError') {
            res.status(401).send({ message: 'Expired or Invalid Token' });
            console.log('api/reservate(post): adding new reservation failed, invalid token');
        } else {
            res.status(500).send({ message: 'Internal Server Error' })
            console.log(e);
        }
    }

});

router.delete('/:id', function(req, res, next) {
    let token = (req.get('Authorization')).split(' ')[1];
    let p = req.params;
    // reservationID
    console.log(`api/reservate(delete): incoming token ${token.slice(0, 9)} ~ ${token.slice(-9)}`);
    try {
        let decoded = jwt.verify(token, jwtConfig.secret);
        if (!decoded) throw 'InvalidTokenError';
        oracledb.bind("\
        DELETE FROM Reservations \
        WHERE ReservationID = :0 AND CustomerID = :1", [
            p.id,
            decoded.UserID
        ], function(err, result) {
            try {
                if (err) {
                    console.log(err);
                    throw 'DatabaseError';
                } else if (result.rowsAffected) {
                    res.status(200).send({ message: 'Deleted a reservation successfully' });
                } else throw 'DatabaseError';
            } catch(e) {
                if (e == 'DatabaseError') {
                    res.status(500).send({ message: 'Server Database Error' });
                    console.log('api/reservate(delete): server database error');
                }
            }
        });
    } catch(e) {
        if (e == 'InvalidTokenError' || e.name == 'TokenExpiredError' || e.name == 'JsonWebTokenError') {
            res.status(401).send({ message: 'Expired or Invalid Token' });
            console.log('api/reservate(delete): deleting a reservation failed, invalid token');
        } else {
            res.status(500).send({ message: 'Internal Server Error' })
            console.log(e);
        }
    }
});

module.exports = router;
