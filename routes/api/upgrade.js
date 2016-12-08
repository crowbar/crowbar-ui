var express = require('express'),
    router = express.Router();

var errors = ['001', '002', '003'];

var status_counter = -1,
    tested_step = 'landing',
    simulate_temporary_downtime = true,
    status = {
        current_step: 'upgrade_prechecks',
        substep: null,
        current_node: null,
        steps: {
            upgrade_prechecks: {
                status: 'pending',
                errors: {}
            },
            upgrade_prepare: {
                status: 'pending',
                errors: {}
            },
            admin_backup: {
                status: 'pending',
                errors: {}
            },
            admin_repo_checks: {
                status: 'pending',
                errors: {}
            },
            admin_upgrade: {
                status: 'pending',
                errors: {}
            },
            database: {
                status: 'pending',
                errors: {}
            },
            nodes_repo_checks: {
                status: 'pending',
                errors: {}
            },
            nodes_services: {
                status: 'pending',
                errors: {}
            },
            nodes_db_dump: {
                status: 'pending',
                errors: {}
            },
            nodes_upgrade: {
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
