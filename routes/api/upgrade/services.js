var express = require('express'),
    router = express.Router(),
    callNumber = -1,
    upgradeModel = require('../../../helpers/upgradeStatus.model');

/* POST openStack services Checks. */
router.post('/', function(req, res) {
    callNumber += 1;
    if (callNumber > 0) {

        if (upgradeModel.getCurrentStepName() === 'nodes_services') {
            //Set current state as Run and save to session
            upgradeModel.runCurrentStep();
            req.session.upgradeStatus = upgradeModel.getStatus();
        }
        setTimeout(function () {

            if (upgradeModel.getCurrentStepName() === 'nodes_services') {
                //Complete current state and save to session
                upgradeModel.completeCurrentStep();
                req.session.upgradeStatus = upgradeModel.getStatus();
            }

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
