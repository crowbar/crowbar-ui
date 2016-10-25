var express = require('express'),
    router = express.Router();

var responseOk = {
        'database_setup': {
            'success': true
        },
        'database_migration': {
            'success': true
        },
        'schema_migration': {
            'success': true
        },
        'crowbar_init': {
            'success': true
        }
    },
    responseFail = {
        'database_setup': {
            'success': true
        },
        'database_migration': {
            'success': true
        },
        'schema_migration': {
            'success': true
        },
        'crowbar_init': {
            'success': false,
            'body': {
                'error': 'crowbar_init: Failed to stop crowbar-init.service'
            }
        }
    };

/* POST new. */
router.post('/', function(req, res) {
    if (req.body.username === 'crowbarfail') {
        setTimeout(function() {
            res.status(422).json(responseFail)
        }, 4000)
    } else {
        setTimeout(function () {
            res.status(200).json(responseOk)
        }, 4000);
    }
});

module.exports = router;
