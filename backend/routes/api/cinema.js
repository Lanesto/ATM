var oracledb = require('../../db/oracledb');

module.exports = function(req, res, next) {
    // return all cinema list
    oracledb.run("\
        SELECT CinemaID, \
        CinemaName, \
        LogoImg \
        FROM Cinemas", function(err, result) {
        if (err) console.log(err);
        else {
            var arr = [];
            var rows = result.rows;
            for (var i in rows) {
                row = rows[i];
                let obj = {
                    CinemaID: -1,
                    CinemaName: '',
                    LogoImg: ''
                }
                for (i in obj) obj[i] = row.shift();
                arr.push(obj);
            }
            console.log(`api/cinema: fetched ${arr.length} row(s)`);
            res.status(200).json(arr);
        }
    });
};
