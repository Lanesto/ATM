var express = require('express');
var router = express.Router();

router.get('/:id', function(req, res, next) {
    // Return comments on specific movie
});

router.post('/:id', function(req, res, next) {
    // Add new comment on specific movie
});

module.exports = router;
