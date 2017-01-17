(function() {

    angular
        .module('suseData.crowbar')
        .constant('UPGRADE_STEPS', {
            prechecks: 'prechecks',
            prepare: 'prepare',
            backup_crowbar: 'backup_crowbar',
            repocheck_crowbar: 'repocheck_crowbar',
            admin: 'admin',
            database: 'database',
            repocheck_nodes: 'repocheck_nodes',
            services: 'services',
            backup_openstack: 'backup_openstack',
            nodes: 'nodes',
            finished: 'finished',
        })
        .constant('UPGRADE_STEP_STATES', {
            pending: 'pending',
            running: 'running',
            passed: 'passed',
            failed: 'failed',
        });
})();
