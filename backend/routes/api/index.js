var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {

});

router.get('/movie', require('./movie'));

module.exports = router;
