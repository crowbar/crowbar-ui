var express = require('express'),
    router = express.Router();

var steps = [
    {
        id: 0,
        title: 'Download Backup of Administration Server',
        state: 'upgrade7.backup',
        active: true,
        enabled: true
    },
    {
        id: 1,
        title: 'Check Administration Server Repositories',
        state: 'upgrade7.administration-repository-checks',
        active: false,
        enabled: false
    },
    {
        id: 2,
        title: 'Upgrade Administration Server',
        state: 'upgrade7.upgrade-administration-server',
        active: false,
        enabled: false
    },
    {
        id: 3,
        title: 'Connect or Create OpenStack Database',
        state: 'upgrade7.database-configuration',
        active: false,
        enabled: false
    },
    {
        id: 4,
        title: 'Check Add-On & Node Repositories',
        state: 'upgrade7.nodes-repositories-checks',
        active: false,
        enabled: false
    },
    {
        id: 5,
        title: 'Migrate OpenStack Database',
        state: 'upgrade7.migrate-openstack-database',
        active: false,
        enabled: false
    },
    {
        id: 6,
        title: 'Upgrade Nodes & Reapply Barclamps',
        state: 'upgrade7.finish-upgrade',
        active: false,
        enabled: false
    }
];

/* GET users listing. */
router.get('/', function(req, res) {
    res.status(200).json(steps);
});

module.exports = router;
