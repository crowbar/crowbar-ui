var express = require('express'),
    router = express.Router();

var errors = ['001', '002', '003'];
var upgrading_state = -1;
var success_state = -1;

/* POST begin admin upgrade. */
router.post('/', function(req, res) {
    if('fail' in req.query && JSON.parse(req.query.fail) === true) {
        res.status(500).json({'errors': errors});
    } else {
        res.status(200).json({
            version: '3.0',
            addons: [],
            upgrade: {
                upgrading: false,
                success: false,
                failed: false
            }
        });
    }
});

/* GET admin upgrade status. */
router.get('/', function(req, res) {
    upgrading_state += 1;
    success_state += 1;
    function upgrading() {
        switch (upgrading_state) {
        case 0:
            return false;
        case 1:
        case 2:
        case 3:
        case 4:
            return true;
        case 5:
        default:
            return false;
        }
    }
    function success() {
        switch (success_state) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
            return false;
        case 5:
        default:
            return true;
        }
    }
    if('fail' in req.query && JSON.parse(req.query.fail) === true) {
        res.status(500).json({'errors': errors});
    } else {
        res.status(200).json({
            version: '3.0',
            addons: [],
            upgrade: {
                upgrading: upgrading(),
                success: success(),
                failed: false
            }
        }
        );
    }
});

module.exports = router;
