var express = require('express'),
    router = express.Router();

/* GET openStack services Checks. */
router.get('/', function(req, res) {
    res.status(200).json({
        'services': true,
        'backup': true
    });
});

module.exports = router;
