var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // render the index.jade view and pass the 'env' variable to it
  res.render('index', {env: req.app.get('env')});
});

module.exports = router;
