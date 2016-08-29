(function() {

    angular
        .module('crowbarData.upgrade')
        .factory('upgradeRepoChecks', upgradeRepoChecks);

    upgradeRepoChecks.$inject = ['$q', '$http'];
    /* @ngInject */
    function upgradeRepoChecks($q, $http) {
        var factory = {
            getAdminRepoChecks: getAdminRepoChecks,
            getAddOnsRepoChecks: function () {}
        };

        return factory;

        function getAdminRepoChecks() {

            var requestOptions = {
                method: 'GET',
                url: '/api/upgrade7/admin-repo-checks'
            };

            return $http(requestOptions);
        }
    }
})();
