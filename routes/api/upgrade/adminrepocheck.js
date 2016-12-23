var express = require('express'),
    router = express.Router(),
    repo_correct = false,
    upgradeModel = require('../../../helpers/upgradeStatus.model');

/* GET Admin Repo Checks. */
router.get('/', function(req, res) {
    var data = {
        'os': {
            'available': true,
            'repos': {}
        },
        'openstack': {
            'available': false,
            'repos': {
                'x86_64': {
                    'missing': [
                        'SUSE-OpenStack-Cloud-7-Pool',
                        'SUSE-OpenStack-Cloud-7-Updates'
                    ]
                }
            }
        }
    };

    if (repo_correct) {
        data['openstack'] = {
            'available': true,
            'repos': {}
        }

        upgradeModel.completeCurrentStep();
        req.session.upgradeStatus = upgradeModel.getStatus();
    }
    repo_correct = !repo_correct;
    res.status(200).json(data);
});

module.exports = router;
