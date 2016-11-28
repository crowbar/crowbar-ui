var express = require('express'),
    router = express.Router();

/* cancel upgrade. */
router.post('/', function(req, res) {
    res.status(200).end();
});

module.exports = router;
