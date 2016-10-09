(function() {

    angular
        .module('suseData.crowbar')
        .factory('openstackFactory', openstackFactory);

    openstackFactory.$inject = ['$q', '$http', 'COMMON_API_V2_HEADERS'];
    /* @ngInject */
    function openstackFactory($q, $http, COMMON_API_V2_HEADERS) {
        var factory = {
            stopServices: stopServices,
            createBackup: createBackup
        };

        return factory;
        
        /**
         * Stop all openstack services
         * 
         * @return {Promise}
         */
        function stopServices() {

            var requestOptions = {
                method: 'POST',
                url: '/api/openstack/services',
                headers: COMMON_API_V2_HEADERS
            };

            return $http(requestOptions);
        }

        /**
         * Create Openstack Database Backup
         * 
         * @return {Promise}
         */
        function createBackup() {

            var requestOptions = {
                method: 'POST',
                url: '/api/openstack/backup',
                headers: COMMON_API_V2_HEADERS
            };

            return $http(requestOptions);
        }
    }
})();
