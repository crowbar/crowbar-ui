var express = require('express'),
    router = express.Router(),
    repo_correct = false;

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
                        'SUSE OpenStack Cloud 7',
                        'SUSE OpenStack Cloud 7 Updates'
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
    }
    repo_correct = !repo_correct;
    res.status(200).json(data);
});

module.exports = router;
