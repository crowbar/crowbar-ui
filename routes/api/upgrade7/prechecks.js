var express = require('express'),
    router = express.Router();

var errors = ['001', '002', '003'];

/* GET users listing. */
router.get('/', function(req, res) {
    if('fail' in req.query && JSON.parse(req.query.fail) === true) {
        res.status(500).json({'errors': errors});
    } else {
        res.status(200).json({
            'updates_installed': true,
            'network_sanity': true,
            'high_availability': true,
            'free_node_available': true
        });
    }
});

module.exports = router;
