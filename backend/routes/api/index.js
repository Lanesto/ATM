var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    // not used yet
});

router.get('/movie', require('./movie'));
router.use('/comment', require('./comment'));
router.use('/reservate', require('./reservate'));
router.get('/cinema', require('./cinema'));

module.exports = router;
