(function() {

    angular
        .module('crowbarData.upgrade')
        .factory('upgradeUpgradeAdminFactory', upgradeUpgradeAdminFactory);

    upgradeUpgradeAdminFactory.$inject = ['$q', '$http'];
    /* @ngInject */
    function upgradeUpgradeAdminFactory($q, $http) {
        return {
            getAdminUpgrade: getAdminUpgrade,
            getAdminUpgradeStatus: getAdminUpgradeStatus
        };

        function getAdminUpgrade() {
            var requestOptions = {
                method: 'POST',
                url: '/api/upgrade7/admin-upgrade'
            };

            return $http(requestOptions);
        }

        function getAdminUpgradeStatus() {
            var requestOptions = {
                method: 'GET',
                url: '/api/upgrade7/admin-upgrade'
            };

            return $http(requestOptions);
        }
    }
})();
