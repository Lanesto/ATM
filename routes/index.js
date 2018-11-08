var express = require('express');
var router = express.Router();
var orcldb = require('../db/db_con');

/* GET home page. */
router.get('/', function(req, res, next) {
    orcldb.run('SELECT * FROM customer', function(result) {
        res.render('index', {
            title: 'Express',
            contents: result.rows || 'Hello Friend!'
        })
    })
});

module.exports = router;
