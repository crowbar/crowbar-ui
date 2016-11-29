(function() {

    angular
        .module('suseData.crowbar')
        .constant('UPGRADE_STEPS', {
            upgrade_prechecks: 'upgrade_prechecks',
            upgrade_prepare: 'upgrade_prepare',
            admin_backup: 'admin_backup',
            admin_repo_checks: 'admin_repo_checks',
            admin_upgrade: 'admin_upgrade',
            database: 'database',
            nodes_repo_checks: 'nodes_repo_checks',
            nodes_services: 'nodes_services',
            nodes_db_dump: 'nodes_db_dump',
            nodes_upgrade: 'nodes_upgrade',
            finished: 'finished',
        })
        .constant('UPGRADE_STEP_STATES', {
            pending: 'pending',
            running: 'running',
            passed: 'passed',
            failed: 'failed',
        });
})();
