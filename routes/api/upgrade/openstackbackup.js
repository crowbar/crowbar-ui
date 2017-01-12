var express = require('express'),
    router = express.Router(),
    callNumber = -1;

/* POST openStack services Checks. */
router.post('/', function(req, res) {
    callNumber += 1;
    if (callNumber > 0) {
        res.status(200).json({
            backup: true
        });
    } else {
        res.status(422).json({
            msg: 'failure message'
        });
    }
});

module.exports = router;
