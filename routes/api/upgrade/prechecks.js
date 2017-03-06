var express = require('express'),
    router = express.Router();

var errors = ['001', '002', '003'],
    checksPass = false,
    bestMethod = false;

/* GET users listing. */
router.get('/', function(req, res) {
    if('fail' in req.query && JSON.parse(req.query.fail) === true) {
        res.status(500).json({'errors': errors});
    } else {
        // fail some checks first, then succeed on second call
        res.status(200).json({
            'checks': {
                'maintenance_updates_installed': { required: true, passed: true },
                'network_checks': { required: true, passed: checksPass },
                'cloud_healthy': { required: true, passed: checksPass },
                'clusters_healthy': { required: false, passed: false },
                'ceph_healthy': { required: false, passed: checksPass },
                'compute_status': { required: true, passed: true },
                'ha_configured': { required: false, passed: true },
                'openstack_check': { required: true, passed: checksPass },
            },
            'best_method': bestMethod ? 'non-disruptive' : 'normal'
        });
    }
    checksPass = true;
    bestMethod = !bestMethod;
});

module.exports = router;
