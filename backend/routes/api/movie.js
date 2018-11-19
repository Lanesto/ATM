var oracledb = require('../../db/oracledb');

// Add TrailerURL
module.exports = function(req, res, next) {
    var q = req.query;
    q.search = q.search || '';
    // from
    // to
    // search
    oracledb.bind("\
        SELECT MovieID, \
        MovieTitle, \
        TO_CHAR(ReleaseDate, 'YYYY-MM-DD'), \
        SUBSTR(TO_CHAR(PlayTime), 5, 5), \
        Genre, \
        Director, \
        Actors, \
        Description, \
        PosterIMG \
        FROM ( \
            SELECT Q.*, ROWNUM N \
            FROM ( \
                SELECT * \
                FROM Movies \
                WHERE MovieTitle LIKE :0 \
                ORDER BY ReleaseDate DESC \
            ) Q \
        ) \
        WHERE N BETWEEN :1 AND :2", [
        `%${q.search}%`,
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
                    MovieID: -1,
                    MovieTitle: '',
                    ReleaseDate: '',
                    PlayTime: '',
                    Genre: '',
                    Director: '',
                    Actors: '',
                    Description: '',
                    PosterIMG: '',
                }
                for (i in obj) obj[i] = row.shift();
                arr.push(obj);
            }
            console.log(`api/movie: fetched ${arr.length} row(s)`);
            res.status(200).json(arr);
        }
    });
};
