var express = require('express'),
router = express.Router();

var steps = [
  {
    id: 0,
    title: 'Backup Admin Node',
    state: 'upgrade7.backup',
    active: true,
    enabled: true
  },
  {
    id: 1,
    title: 'Repositories check',
    state: 'upgrade7.verify-repos',
    active: false,
    enabled: false
  },
  {
    id: 2,
    title: 'Upgrade Admin Server',
    state: 'upgrade7.upgrade-admin',
    active: false,
    enabled: false
  },
  {
    id: 3,
    title: 'Database Configuration',
    state: 'upgrade7.databse',
    active: false,
    enabled: false
  },
  {
    id: 4,
    title: 'Migrate OpenStack Database',
    state: 'upgrade7.migrate-openstack-database',
    active: false,
    enabled: false
  },
  {
    id: 5,
    title: 'Finish Upgrade',
    state: 'upgrade7.finish-upgrade',
    active: false,
    enabled: false
  }
];

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.status(200).json(steps);
});

module.exports = router;
