var express = require('express'),
    router = express.Router(),
    upgradeModel = require('../../../helpers/upgradeStatus.model');

/* GET Nodes Repo Checks. */
router.get('/', function(req, res) {

    upgradeModel.completeCurrentStep();
    req.session.upgradeStatus = upgradeModel.getStatus();

    res.status(200).json({
        'ceph': {
            'available': true,
            'repos': {}
        },
        'ha': {
            'available': true,
            'repos': {}
        },
        'os': {
            'available': true,
            'repos': {}
        },
        'openstack': {
            'available': true,
            'repos': {}
        }
    });
});

module.exports = router;
