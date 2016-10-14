var express = require('express'),
    router = express.Router();

/* GET Admin Repo Checks. */
router.post('/', function(req, res) {
    res.status(200).json({
        'id': 1,
        'name': 'testbackup',
        'version': '4.0',
        'size': 76815,
        'created_at': '2016-09-27T06:05:10.208Z',
        'updated_at': '2016-09-27T06:05:10.208Z',
        'migration_level': 20160819142156
    });
});

module.exports = router;
