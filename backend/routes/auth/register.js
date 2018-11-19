var oracledb = require('../../db/oracledb');

module.exports = function(req, res, next) {
    var b = req.body;
    console.log(`auth/register: incoming new registration`);
    oracledb.bind("\
        INSERT INTO Customers(CustomerID, Password, CustomerName, Gender, Age) \
        VALUES(:0, :1, :2, :3, :4)", [
        b.id,
        b.password,
        b.name,
        b.gender,
        b.age
    ], function(err, result) {
        try {
            if (err) {
                console.log(err);
                throw 'DatabaseError';
            }
            else {
                if (result.rowsAffected) {
                    res.status(201).send({ message: 'Registration Completed' });
                }
            }
        } catch(e) {
            if (e == "DatabaseError") {
                res.status(412).send({ message: 'ID Already Exists' });
                console.log('auth/register: invalid registration request');
            } else {
                res.status(500).send({ message: 'Internal Server Error' });
                console.log(e);
            }
        }
    });
};
