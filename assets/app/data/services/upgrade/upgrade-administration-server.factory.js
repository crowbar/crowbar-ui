(function() {

    angular
        .module('crowbarData.upgrade')
        .factory('upgradeUpgradeAdministrationServerFactory', upgradeUpgradeAdministrationServerFactory);

    upgradeUpgradeAdministrationServerFactory.$inject = ['$q', '$http', 'COMMON_API_V2_HEADERS'];
    /* @ngInject */
    function upgradeUpgradeAdministrationServerFactory($q, $http, COMMON_API_V2_HEADERS) {
        return {
            getAdminUpgrade: getAdminUpgrade,
            getAdminUpgradeStatus: getAdminUpgradeStatus
        };

        function getAdminUpgrade() {
            var requestOptions = {
                method: 'POST',
                url: '/api/upgrade7/admin-upgrade',
                headers: COMMON_API_V2_HEADERS
            };

            return $http(requestOptions);
        }

        function getAdminUpgradeStatus() {
            var requestOptions = {
                method: 'GET',
                url: '/api/upgrade7/admin-upgrade',
                headers: COMMON_API_V2_HEADERS
            };

            return $http(requestOptions);
        }
    }
})();
