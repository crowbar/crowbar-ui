var express = require('express'),
    router = express.Router();

var errors = ['001', '002', '003'];

var status_counter = -1,
    tested_step = 'nodes',
    current_count = 6,
    simulate_temporary_downtime = true,
    status = {
        current_step: 'prechecks',
        substep: null,
        current_nodes:  [
            {
                alias: 'controller-1',
                name: 'controller.1234.suse.com',
                ip: '192.168.123.4',
                role: 'controller',
                state: 'upgrading'
            },
            {
                alias: 'controller-2',
                name: 'controller.1235.suse.com',
                ip: '192.168.123.5',
                role: 'controller',
                state: 'upgrading'
            },
            {
                alias: 'controller-3',
                name: 'controller.1236.suse.com',
                ip: '192.168.123.6',
                role: 'controller',
                state: 'upgrading'
            },
            {
                alias: 'controller-4',
                name: 'controller.1237.suse.com',
                ip: '192.168.123.7',
                role: 'controller',
                state: 'upgrading'
            },
            {
                alias: 'controller-5',
                name: 'controller.1238.suse.com',
                ip: '192.168.123.8',
                role: 'controller',
                state: 'upgrading'
            },
            {
                alias: 'controller-6',
                name: 'controller.1239.suse.com',
                ip: '192.168.123.9',
                role: 'controller',
                state: 'upgrading'
            }
        ].slice(0, current_count),
        current_node_action: 'live-evacuting nova instances',
        remaining_nodes: 95,
        upgraded_nodes: 60,
        crowbar_backup: '/var/lib/crowbar/backup/upgrade-backup.....tar.gz',
        openstack_backup: '/var/lib/crowbar/backup/6-yp-7-openstack_dump.sql.gz',
        suggested_upgrade_mode: 'non_disruptive',
        selected_upgrade_mode: 'normal',
        steps: {
            prechecks: {
                status: 'pending',
                errors: {}
            },
            prepare: {
                status: 'pending',
                errors: {}
            },
            backup_crowbar: {
                status: 'pending',
                errors: {}
            },
            repocheck_crowbar: {
                status: 'pending',
                errors: {}
            },
            admin: {
                status: 'pending',
                errors: {}
            },
            database: {
                status: 'pending',
                errors: {}
            },
            repocheck_nodes: {
                status: 'pending',
                errors: {}
            },
            services: {
                status: 'pending',
                errors: {}
            },
            backup_openstack: {
                status: 'pending',
                errors: {}
            },
            nodes: {
                status: 'pending',
                errors: {}
            },
            finished: {
                status: 'pending',
                errors: {}
            }
        }
    };

/* GET upgrade status. */
router.get('/', function(req, res) {
    status_counter += 1;

    function testedStatus() {
        switch (status_counter) {
        default:
        case 0:
            return 'pending';
        case 1:
            return 'running';
        case 2:
        case 3:
            return simulate_temporary_downtime ? null : 'running';
        case 4:
            return 'running';
        case 5:
            return 'passed';
        }
    }
    if('fail' in req.query && JSON.parse(req.query.fail) === true) {
        res.status(500).json({'errors': errors});
    } else {
        status.current_step = tested_step;
        for (var step in status.steps) {
            if (step == tested_step) {
                break;
            }
            status.steps[step].status = 'passed';
        }
        status.steps[tested_step].status = testedStatus();

        // simulated failure
        if (status.steps[tested_step].status) {
            res.status(200).json(status);
        } else {
            res.status(502).end();
        }
    }
});

module.exports = router;
