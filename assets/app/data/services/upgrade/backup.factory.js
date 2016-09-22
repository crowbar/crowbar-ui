(function() {

    angular
        .module('crowbarData.upgrade')
        .factory('upgradeBackupFactory', upgradeBackupFactory);

    upgradeBackupFactory.$inject = ['$q', '$http', 'COMMON_API_V2_HEADERS'];
    /* @ngInject */
    function upgradeBackupFactory($q, $http, COMMON_API_V2_HEADERS) {
        var factory = {
            create: getBackup
        };

        return factory;

        function getBackup() {

            var requestOptions = {
                method: 'POST',
                cache: false,
                responseType: 'arraybuffer',
                url: '/api/upgrade7/backup',
                headers: COMMON_API_V2_HEADERS
            };

            return $http(requestOptions);
        }
    }
})();
