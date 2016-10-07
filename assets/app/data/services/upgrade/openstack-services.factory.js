(function() {

    angular
        .module('crowbarData.upgrade')
        .factory('openStackFactory', openStackFactory);

    openStackFactory.$inject = ['$q', '$http'];
    /* @ngInject */
    function openStackFactory($q, $http) {
        var factory = {
            stopOpenstackServices: stopOpenstackServices,
            createOpenstackBackup: createOpenstackBackup
        };

        return factory;
        
        function stopOpenstackServices() {

            var requestOptions = {
                method: 'GET',
                url: '/api/upgrade7/openstack-services/stop'
            };

            return $http(requestOptions);
        }

        function createOpenstackBackup() {

            var requestOptions = {
                method: 'GET',
                url: '/api/upgrade7/openstack-services/backup'
            };

            return $http(requestOptions);
        }
    }
})();
