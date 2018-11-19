var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {

});

router.post('/login', require('./login'));
router.post('/refresh', require('./refresh'));
router.post('/register', require('./register'));
router.use('/account', require('./account'));

module.exports = router;
