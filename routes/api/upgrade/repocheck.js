var express = require('express'),
    router = express.Router();

/* GET Nodes Repo Checks. */
router.get('/', function(req, res) {
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
