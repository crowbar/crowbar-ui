var express = require('express'),
    router = express.Router(),
    path = require('path'),
    mime = require('mime'),
    fs = require('fs'),
    upgradeModel = require('../../../helpers/upgradeStatus.model');

router.get('/', function(req, res) {

    upgradeModel.completeCurrentStep();
    req.session.upgradeStatus = upgradeModel.getStatus();

    var file = __dirname + '/1.zip',
        filename = path.basename(file),
        mimetype = mime.lookup(file),
        filestream = fs.createReadStream(file);

    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    res.setHeader('Content-type', mimetype);

    filestream.pipe(res);

});

module.exports = router;
