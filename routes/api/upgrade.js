var express = require('express'),
    router = express.Router();

var errors = ['001', '002', '003'];

var status_counter = -1,
    tested_step = 'nodes',
    simulate_temporary_downtime = true,
    status = {
        current_step: 'prechecks',
        substep: null,
        current_node:  {
            alias: 'controller-1',
            name: 'controller.1234.suse.com',
            ip: '1.2.3.4',
            role: 'controller',
            state: 'post-upgrade'
        },
        remaining_nodes: 95,
        upgraded_nodes: 60,
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
        default:
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
