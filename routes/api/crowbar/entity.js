var express = require('express'),
    router = express.Router();

/* GET crowbar entity. */
router.get('/', function(req, res) {
    res.status(200).json({
        'version': '4.0',
        'addons': [
            'ceph',
            'ha'
        ]
    });
});

module.exports = router;
