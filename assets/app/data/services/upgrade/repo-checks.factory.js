(function() {

    angular
        .module('crowbarData.upgrade')
        .factory('upgradeRepoChecksFactory', upgradeRepoChecksFactory);

    upgradeRepoChecksFactory.$inject = ['$q', '$http'];
    /* @ngInject */
    function upgradeRepoChecksFactory($q, $http) {
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
