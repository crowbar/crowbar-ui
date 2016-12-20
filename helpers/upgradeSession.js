var express = require('express'),
    router = express.Router(),
    upgradeModel = require('./upgradeStatus.model');

router.use(function (req, res, next) {
    //console.log('Intercepting request: ' + req.path);
    if (req.session.upgradeStatus) {
        //console.log('========== Restoring Upgrade Status object');
        upgradeModel.setStatus(req.session.upgradeStatus);
    } else {
        //console.log('++++++++++ New upgrade Status object created');
        req.session.upgradeStatus = upgradeModel.getDefaultStatus();
    }

    next();
});

module.exports = router;
