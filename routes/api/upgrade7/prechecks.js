var express = require('express'),
    router = express.Router();

var errors = ['001', '002', '003'];

/* GET users listing. */
router.get('/', function(req, res) {
    if('fail' in req.query && JSON.parse(req.query.fail) === true) {
        res.status(500).json({'errors': errors});
    } else {
        res.status(200).json({
            'updates_installed': {status: true},
            'network_sanity': {status: true},
            'high_availability': {status: true},
            'free_node_available': {status: true}
        });
    }
});

module.exports = router;
