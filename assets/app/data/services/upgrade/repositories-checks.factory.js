(function() {

    angular
        .module('crowbarData.upgrade')
        .factory('upgradeRepositoriesChecksFactory', upgradeRepositoriesChecksFactory);

    upgradeRepositoriesChecksFactory.$inject = ['$q', '$http'];
    /* @ngInject */
    function upgradeRepositoriesChecksFactory($q, $http) {
        var factory = {
            getAdminRepoChecks: getAdminRepoChecks,
            getNodesRepoChecks: getNodesRepoChecks
        };

        return factory;

        function getAdminRepoChecks() {

            var requestOptions = {
                method: 'GET',
                url: '/api/upgrade7/admin-repo-checks'
            };

            return $http(requestOptions);
        }

        function getNodesRepoChecks() {

            var requestOptions = {
                method: 'GET',
                url: '/api/upgrade7/nodes-repo-checks'
            };

            return $http(requestOptions);
        }
    }
})();
