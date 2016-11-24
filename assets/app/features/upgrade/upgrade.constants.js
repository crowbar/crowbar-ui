(function() {

    angular
        .module('crowbarApp.upgrade')
        .constant('PRODUCTS_REPO_CHECKS_MAP', {
            'os': ['SLES12-SP2-Pool', 'SLES12-SP2-Updates'],
            'ha': ['SLE12-SP2-HA-Pool', 'SLE12-SP2-HA-Updates'],
            'openstack': ['SUSE-OpenStack-Cloud-7-Pool', 'SUSE-OpenStack-Cloud-7-Updates'],
            'ceph': ['SUSE-Enterprise-Storage-4-Pool', 'SUSE-Enterprise-Storage-4-Updates']
        })
        .constant('ADDONS_PRECHECK_MAP', {
            'ha': ['clusters_healthy'],
            'ceph': ['ceph_healthy']
        })
        .constant('PREPARE_TIMEOUT_INTERVAL', 1000)
        .constant('ADMIN_UPGRADE_ALLOWED_DOWNTIME', 30 * 60 * 1000)
        .constant('ADMIN_UPGRADE_TIMEOUT_INTERVAL', 5000)
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
        .constant('STEP_STATES', {
            pending: 'pending',
            running: 'running',
            passed: 'passed',
            failed: 'failed',
        });
})();
