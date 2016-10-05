(function() {

    angular
        .module('crowbarApp.upgrade')
        .constant('NODES_PRODUCTS_REPO_CHECKS_MAP', {
            'os': ['SLES12-SP2-Pool', 'SLES12-SP2-Updates'],
            'ha': ['SLE12-SP2-HA-Pool', 'SLE12-SP2-HA-Updates'],
            'openstack': ['SUSE-OpenStack-Cloud-7-Pool', 'SUSE-OpenStack-Cloud-7-Updates'],
            'ceph': ['SUSE-Enterprise-Storage-4-Pool', 'SUSE-Enterprise-Storage-4-Updates']
        });
})();
