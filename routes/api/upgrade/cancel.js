var express = require('express'),
    router = express.Router();

/* cancel upgrade. */
router.post('/', function(req, res) {
    //Destroy the current session.
    req.session.destroy();
    res.status(200).end();
});

module.exports = router;
