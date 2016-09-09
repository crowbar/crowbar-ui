var express = require('express'),
    router = express.Router();

var errors = ['001', '002', '003'];
var workleft = 0;

/* POST begin admin upgrade. */
router.post('/', function(req, res) {
    if('fail' in req.query && JSON.parse(req.query.fail) === true) {
        res.status(500).json({'errors': errors});
    } else {
        workleft = 5;
        res.status(200).json({
            'dummy_status': 'tbd',
            'completed': workleft <= 0
        });
    }
});

/* GET admin upgrade status. */
router.get('/', function(req, res) {
    workleft -= 1;
    if('fail' in req.query && JSON.parse(req.query.fail) === true) {
        res.status(500).json({'errors': errors});
    } else {
        res.status(200).json({
            'dummy_status': 'tbd',
            'completed': workleft <= 0
        });
    }
});

module.exports = router;
