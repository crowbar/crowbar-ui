(function() {

    angular
        .module('crowbarData.upgrade')
        .factory('upgradeOpenStackServicesFactory', upgradeOpenStackServicesFactory);

    upgradeOpenStackServicesFactory.$inject = ['$q', '$http'];
    /* @ngInject */
    function upgradeOpenStackServicesFactory($q, $http) {
        var factory = {
            getOpenStackServices: getOpenStackServices
        };

        return factory;

        function getOpenStackServices() {

            var requestOptions = {
                method: 'GET',
                url: '/api/upgrade7/openstack-services'
            };

            return $http(requestOptions);
        }
    }
})();
