(function() {

    angular
        .module('crowbarData.upgrade')
        .factory('upgradeBackupFactory', upgradeBackupFactory);

    upgradeBackupFactory.$inject = ['$q', '$http'];
    /* @ngInject */
    function upgradeBackupFactory($q, $http) {
        var factory = {
            create: getBackup
        };

        return factory;

        function getBackup() {

            var requestOptions = {
                method: 'POST',
                cache: false,
                responseType: 'arraybuffer',
                url: '/api/upgrade7/backup'
            };

            return $http(requestOptions);
        }
    }
})();
