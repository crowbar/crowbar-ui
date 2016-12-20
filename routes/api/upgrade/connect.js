var express = require('express'),
    router = express.Router(),
    upgradeModel = require('../../../helpers/upgradeStatus.model'),
    responseOk = {
        'database_setup': {
            'success': true
        },
        'database_migration': {
            'success': true
        },
        'schema_migration': {
            'success': true
        },
        'crowbar_init': {
            'success': true
        }
    },
    responseFailCrowbar = {
        'database_setup': {
            'success': true
        },
        'database_migration': {
            'success': true
        },
        'schema_migration': {
            'success': true
        },
        'crowbar_init': {
            'success': false,
            'body': {
                'error': 'crowbar_init: Failed to stop crowbar-init.service'
            }
        }
    },
    responseFailDatabase = {
        'database_setup': {
            'success': true
        },
        'database_migration': {
            'success': true
        },
        'schema_migration': {
            'success': true
        },
        'crowbar_init': {
            'success': false,
            'body': {
                'error': 'crowbar_init: Failed to stop crowbar-init.service'
            }
        }
    };

/* POST connect. */
router.post('/', function(req, res) {
    if (req.body.username === 'crowbarfail') {
        setTimeout(function () {
            res.status(422).json(responseFailCrowbar);
        }, 4000);
    } else if (req.body.username === 'databasefail') {
        setTimeout(function () {
            res.status(406).json(responseFailDatabase);
        }, 4000);
    } else {

        upgradeModel.runCurrentStep();
        req.session.upgradeStatus = upgradeModel.getStatus();

        setTimeout(function () {

            upgradeModel.completeCurrentStep();
            req.session.upgradeStatus = upgradeModel.getStatus();

            res.status(200).json(responseOk);
        }, 4000);
    }
});

module.exports = router;
