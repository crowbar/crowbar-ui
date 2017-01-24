(function() {

    angular
        .module('crowbarApp.upgrade')
        .constant('ADDONS_PRECHECK_MAP', {
            'ha': ['clusters_healthy'],
            'ceph': ['ceph_healthy']
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
        .constant('NODES_UPGRADE_TIMEOUT_INTERVAL', 5000)
        .constant('UPGRADE_MODES', {
            nondisruptive: 'non-disruptive',
            disruptive: 'disruptive',
            none: 'none',
        });
})();
