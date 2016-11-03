(function() {

    angular
        .module('suseData.crowbar')
        .factory('crowbarUtilsFactory', crowbarUtilsFactory);

    crowbarUtilsFactory.$inject = ['$q', '$http', 'COMMON_API_V1_HEADERS'];
    /* @ngInject */
    function crowbarUtilsFactory($q, $http, COMMON_API_V1_HEADERS) {
        var factory = {
            getAdminBackup: getAdminBackup
        };

        return factory;

        /**
         * Download a specific backup based on its Id
         *
         * @param  {Number} Backup Id to be downloaded
         * @return {Promise}
         */
        function getAdminBackup(id) {
            // this should never happen, caller should make sure 'id' is set
            if (angular.isUndefined(id)) {
                throw Error('getAdminBackup() called without id.');
            }

            var requestOptions = {
                method: 'GET',
                cache: false,
                responseType: 'blob',
                url: '/utils/backups/' + id + '/download',
                // this is not strictly needed here, but can be left for consistency
                headers: COMMON_API_V1_HEADERS
            };

            return $http(requestOptions);
        }
    }
})();
