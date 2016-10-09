var express = require('express'),
    router = express.Router();


/* POST openStack services Checks. */
router.post('/', function(req, res) {
    res.status(200).json({
        'services': true
    });
});

module.exports = router;
