var express = require('express');
var router = express.Router();
var oracledb = require('../db/db_con');

router.get('/', function(req, res, next) {
    oracledb.run("\
        SELECT MovieID, \
        MovieTitle, \
        TO_CHAR(ReleaseDate, 'YYYY-MM-DD'), \
        SUBSTR(TO_CHAR(PlayTime), 5, 5), \
        PosterIMG \
        FROM Movies", function(err, result) {
        if (err) console.log(err);
        else {
            arr = [];
            rows = result.rows;
            for (var i in rows) {
                row = rows[i];
                arr.push({
                    MovieID: row.shift(),
                    MovieTitle: row.shift(),
                    ReleaseDate: row.shift(),
                    PlayTime: row.shift(),
                    PosterIMG: row.shift()
                });
            }
            res.json(arr);
        }
    });
})

router.get('/:id', function(req, res, next) {
    id = parseInt(req.params.id, 10);
    oracledb.bind("\
        SELECT MovieTitle, \
        TO_CHAR(ReleaseDate, 'YYYY-MM-DD'), \
        SUBSTR(TO_CHAR(PlayTime), 5, 5), \
        PosterIMG \
        FROM Movies \
        WHERE MovieID = :id", [id], function(err, result) {
        if (err) console.log(err);
        else {
            // only first data will be used (must be given 1)
            row = result.rows[0];
            res.json({
                MovieTitle: row.shift(),
                ReleaseDate: row.shift(),
                PlayTime: row.shift(),
                PosterIMG: row.shift()
            });
        }
    });
})

module.exports = router;
