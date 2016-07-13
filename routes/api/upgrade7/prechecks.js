var express = require('express'),
router = express.Router();

var errors = ['001', '002', '003'];

/* GET users listing. */
router.get('/', function(req, res, next) {
  if(req.query.fail) {
    res.status(500).json({'errors': errors});
  } else {
    res.status(200);
  }
});

module.exports = router;
