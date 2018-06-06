(function() {

    angular
        .module('crowbarApp.upgrade')
        .constant('ADDONS_PRECHECK_MAP', {
            'ha': ['clusters_healthy']
        })
        .constant('UNEXPECTED_ERROR_DATA', {
            title: 'unexpected_error',
            errors: {
                unexpected_error: {
                    data: 'An unexpected error ocurred',
                    help: 'Please check logs for more details'
                }
            }
        })
        .constant('UPGRADE_LAST_STATE_KEY', 'crowbar.upgrade.lastUIState')
        .constant('PREPARE_TIMEOUT_INTERVAL', 1000)
        .constant('ADMIN_UPGRADE_ALLOWED_DOWNTIME', 30 * 60 * 1000)
        .constant('ADMIN_UPGRADE_TIMEOUT_INTERVAL', 5000)
        .constant('NODES_UPGRADE_TIMEOUT_INTERVAL', 30 * 1000)
        .constant('STOP_OPENSTACK_SERVICES_TIMEOUT_INTERVAL', 5000)
        .constant('OPENSTACK_BACKUP_TIMEOUT_INTERVAL', 1000)
        .constant('UPGRADE_MODES', {
            nondisruptive: 'non_disruptive',
            normal: 'normal',
            none: 'none',
        });
})();
