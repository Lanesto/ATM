var oracledb = require('../../db/oracledb');

module.exports = function(req, res, next) {
    // Return movie informations
    let q = req.query;
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
            let arr = [];
            let rows = result.rows;
            for (let i in rows) {
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
                for (let j in obj) obj[j] = row.shift();
                arr.push(obj);
            }
            console.log(`api/movie: fetched ${arr.length} row(s)`);
            res.status(200).json(arr);
        }
    });
};
