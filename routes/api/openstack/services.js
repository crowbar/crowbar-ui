var express = require('express'),
    router = express.Router(),
    callNumber = -1;

/* POST openStack services Checks. */
router.post('/', function(req, res) {
    callNumber += 1;
    if (callNumber > 0) {
        // Delay the response 4 seconds
        setTimeout(function() {
            res.status(200).send()
        }, 4000
        )
    } else {
        // Delay the response 1 seconds
        setTimeout(function() {
            res.status(500).send()
        }, 1000
        )
    }
});

module.exports = router;
