var express = require('express'),
    router = express.Router();

/* GET Nodes Repo Checks. */
router.get('/', function(req, res) {
    res.status(200).json({
        'SLES_12_SP2': true,
        'SLES_12_SP2_Updates': true,
        'SLES_OpenStack_Cloud_7': true,
        'SLES_OpenStack_Cloud_7_Updates': true,
        'SLE_HA_12_SP2': true,
        'SLE_HA_12_SP2_Updates': true,
        'SUSE_Enterprise_Storage_4': true,
        'SUSE_Enterprise_Storage_4_Updates': true
    });
});

module.exports = router;
