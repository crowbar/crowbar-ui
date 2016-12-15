var express = require('express'),
    router = express.Router();

/* nodes upgrade. */
router.post('/', function(req, res) {
    res.status(200).end();
});

module.exports = router;
