(function() {

    angular
        .module('crowbarData.upgrade')
        .factory('upgradeRepositoriesChecksFactory', upgradeRepositoriesChecksFactory);

    upgradeRepositoriesChecksFactory.$inject = ['$q', '$http', 'COMMON_API_V2_HEADERS'];
    /* @ngInject */
    function upgradeRepositoriesChecksFactory($q, $http, COMMON_API_V2_HEADERS) {
        var factory = {
            getAdminRepoChecks: getAdminRepoChecks,
            getNodesRepoChecks: getNodesRepoChecks
        };

        return factory;

        function getAdminRepoChecks() {

            var requestOptions = {
                method: 'GET',
                url: '/api/upgrade7/admin-repo-checks',
                headers: COMMON_API_V2_HEADERS
            };

            return $http(requestOptions);
        }

        function getNodesRepoChecks() {

            var requestOptions = {
                method: 'GET',
                url: '/api/upgrade7/nodes-repo-checks',
                headers: COMMON_API_V2_HEADERS
            };

            return $http(requestOptions);
        }
    }
})();
