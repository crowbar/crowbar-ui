var express = require('express'),
    router = express.Router(),
    path = require('path'),
    mime = require('mime'),
    fs = require('fs');

router.get('/', function(req, res) {

    var file = __dirname + '/1.zip',
        filename = path.basename(file),
        mimetype = mime.lookup(file),
        filestream = fs.createReadStream(file);

    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    res.setHeader('Content-type', mimetype);

    filestream.pipe(res);
});

module.exports = router;
