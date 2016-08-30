var express = require('express'),
    router = express.Router();

/* GET Admin Repo Checks. */
router.get('/', function(req, res) {
    res.status(200).json({
        'SLES_12_SP2': true,
        'SLES_12_SP2_Updates': true,
        'SLES_OpenStack_Cloud_7': true,
        'SLES_OpenStack_Cloud_7_Updates': true
    });
});

module.exports = router;
