var express = require('express'),
    router = express.Router(),
    upgradeModel = require('../../../helpers/upgradeStatus.model');

var errors = ['001', '002', '003'];

/* Begin upgrade. */
router.post('/', function(req, res) {
    if('fail' in req.query && JSON.parse(req.query.fail) === true) {
        res.status(500).json({'errors': errors});
    } else {
        upgradeModel.completeCurrentStep();
        req.session.upgradeStatus = upgradeModel.getStatus();
        res.status(200).end();
    }
});

module.exports = router;
