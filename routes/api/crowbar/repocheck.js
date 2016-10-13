var express = require('express'),
    router = express.Router();
var repo_correct = false;

/* GET Admin Repo Checks. */
router.get('/', function(req, res) {
    var data = {
        'os': {
            'available': true,
            'repos': {}
        },
        'cloud': {
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
        data['cloud'] = {
            'available': true,
            'repos': {}
        }
    }
    repo_correct = !repo_correct;
    res.status(200).json(data);
});

module.exports = router;
