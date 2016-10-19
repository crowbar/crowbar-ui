var express = require('express'),
    router = express.Router();

var errors = ['001', '002', '003'];

/* Begin upgrade. */
router.post('/', function(req, res) {
    if('fail' in req.query && JSON.parse(req.query.fail) === true) {
        res.status(500).json({'errors': errors});
    } else {
        res.status(200).end();
    }
});

module.exports = router;
