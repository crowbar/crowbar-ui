var express = require('express'),
    router = express.Router(),
    callNumber = -1;

/* POST openStack services Checks. */
router.post('/', function(req, res) {
    callNumber += 1;
    if (callNumber > 0) {
        res.status(200).send();
    } else {
        res.status(500).send();
    }
});

module.exports = router;
