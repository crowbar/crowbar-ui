var express = require('express'),
    router = express.Router();

var errors = ['001', '002', '003'];

/* GET users listing. */
router.get('/', function(req, res) {
    if('fail' in req.query && JSON.parse(req.query.fail) === true) {
        res.status(500).json({'errors': errors});
    } else {
        res.status(200).json({
            'maintenance_updates_installed': { required: true, passed: true },
            'network_checks': { required: true, passed: true },
            'clusters_healthy': { required: true, passed: true },
            'ceph_healthy': { required: true, passed: true },
            'compute_resources_available': { required: false, passed: true }
        });
    }
});

module.exports = router;
