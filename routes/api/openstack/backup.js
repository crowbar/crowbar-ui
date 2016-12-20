var express = require('express'),
    router = express.Router(),
    callNumber = -1,
    upgradeModel = require('../../../helpers/upgradeStatus.model');

/* POST openStack services Checks. */
router.post('/', function(req, res) {
    callNumber += 1;
    if (callNumber > 0) {

        if (upgradeModel.getCurrentStepName() === 'nodes_db_dump') {
            upgradeModel.completeCurrentStep();
            req.session.upgradeStatus = upgradeModel.getStatus();
        }

        res.status(200).json({
            backup: true
        });
    } else {

        if (upgradeModel.getCurrentStepName() === 'nodes_db_dump') {
            upgradeModel.runCurrentStep();
            req.session.upgradeStatus = upgradeModel.getStatus();
        }

        res.status(422).json({
            msg: 'failure message'
        });
    }
});

module.exports = router;
