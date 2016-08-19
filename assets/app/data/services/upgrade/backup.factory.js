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
                method: 'GET',
                url: '/api/upgrade7/prechecks'
            };

            return $http(requestOptions);
        }
    }
})();
