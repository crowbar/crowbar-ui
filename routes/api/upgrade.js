/*eslint no-console: ["error", { allow: ["warn", "error", "log"] }] */
var express = require('express'),
    router = express.Router(),
    upgradeModel = require('../../helpers/upgradeStatus.model');

var stepStatus = {
        pending: 'pending',
        running: 'running',
        passed: 'passed',

    },
    status_counter = 0,
    status,
    simulateDowntimeSteps = [
        'admin_upgrade'
    ];

/* GET upgrade status. */
router.get('/', function(req, res) {

    if (upgradeModel.getCurrentStepName() === 'nodes_upgrade' &&
        upgradeModel.getCurrentStep().status === stepStatus.running) {
        upgradeModel.setUpdatedNodes(status_counter * 25);
    }

    if (upgradeModel.getCurrentStep().status === null ||
        upgradeModel.getCurrentStep().status === stepStatus.running
    ) {
        console.log('status counter: ' + status_counter);
        switch (status_counter) {
        case 0:
        case 1:
        case 2:
            upgradeModel.runCurrentStep();
            break;
        case 3:
            if (simulateDowntimeSteps[upgradeModel.getCurrentStepName()]) {
                console.log('Simulating Downtime for ' + upgradeModel.getCurrentStepName());
                upgradeModel.simulateDowntime();
            } else {
                upgradeModel.runCurrentStep();
            }
            break;
        case 4:
            upgradeModel.runCurrentStep();
            break;
        case 5:
        default:
            upgradeModel.completeCurrentStep();
            console.log('Completed: ' + upgradeModel.getCurrentStepName());
            // reset the status counter
            status_counter = 0;
            break;
        }
        // Increase the status counter
        status_counter++;
    }
    console.log('---- Step: %s - Status: %s', upgradeModel.getCurrentStepName(), upgradeModel.getCurrentStep().status);

    status = upgradeModel.getStatus();
    // simulated failure
    if (upgradeModel.getCurrentStep().status) {
        res.status(200).json(status);
    } else {
        res.status(502).end();
    }
});

module.exports = router;
