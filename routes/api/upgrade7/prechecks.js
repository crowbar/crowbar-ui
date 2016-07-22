var express = require('express'),
router = express.Router();

var errors = ['001', '002', '003'];

/* GET users listing. */
router.get('/', function(req, res, next) {
  if('fail' in req.query && JSON.parse(req.query.fail) === true) {
    res.status(500).json({'errors': errors});
  } else {
    res.sendStatus(200);
  }
});

module.exports = router;
