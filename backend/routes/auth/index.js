var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {

});

router.post('/login', require('./login'));
router.post('/refresh', require('./refresh'));
router.put('/register', require('./register'));

module.exports = router;
