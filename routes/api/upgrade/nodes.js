var express = require('express'),
    router = express.Router(),
    upgradeModel = require('../../../helpers/upgradeStatus.model');

/* nodes upgrade. */
router.post('/', function(req, res) {

    upgradeModel.runCurrentStep();
    req.session.upgradeStatus = upgradeModel.getStatus();

    res.status(200).end();
});

module.exports = router;
