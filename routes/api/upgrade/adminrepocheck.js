var express = require('express'),
    router = express.Router(),
    repo_correct = false;

/* GET Admin Repo Checks. */
router.get('/', function(req, res) {
    var data = {
        'os': {
            'available': true,
            'repos': ['SLES12-SP2-Pool', 'SLES12-SP2-Updates'],
            'errors': {}
        },
        'openstack': {
            'available': false,
            'repos': ['SUSE-OpenStack-Cloud-7-Pool', 'SUSE-OpenStack-Cloud-7-Updates'],
            'errors': {
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
        data.openstack.available = true;
        data.openstack.errors = {}
    }
    repo_correct = !repo_correct;
    res.status(200).json(data);
});

module.exports = router;
