(function() {

    angular
        .module('crowbarData.upgrade')
        .factory('upgradeBackupFactory', upgradeBackupFactory);

    upgradeBackupFactory.$inject = ['$q', '$http', '$filter', 'COMMON_API_V2_HEADERS'];
    /* @ngInject */
    function upgradeBackupFactory($q, $http, $filter, COMMON_API_V2_HEADERS) {
        var factory = {
            create: createBackup,
            download: downloadBackup
        };

        return factory;

        function createBackup() {

            var requestOptions = {
                method: 'POST',
                url: '/api/crowbar/backups',
                data: { name: 'upgrade-backup-' + $filter('date')(new Date, 'yyyyMMddHHmmss') },
                headers: COMMON_API_V2_HEADERS
            };

            return $http(requestOptions);
        }

        function downloadBackup(id) {
            // this should never happen, caller should make sure 'id' is set
            if (angular.isUndefined(id)) {
                throw Error('downloadBackup() called without id.');
            }

            var requestOptions = {
                method: 'GET',
                cache: false,
                responseType: 'arraybuffer',
                url: '/api/crowbar/backups/' + id + '/download',
                headers: COMMON_API_V2_HEADERS
            };

            return $http(requestOptions);
        }
    }
})();
