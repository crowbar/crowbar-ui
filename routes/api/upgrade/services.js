var express = require('express'),
    router = express.Router(),
    callNumber = -1;

/* POST openStack services Checks. */
router.post('/', function(req, res) {
    callNumber += 1;
    if (callNumber > 0) {
        setTimeout(function () {
            res.status(200).send();
        }, 3000)
    } else {
        res.status(422).json({
            errors: {
                services: {
                    data: 'ERROR'
                }
            }
        });
    }
});

module.exports = router;
