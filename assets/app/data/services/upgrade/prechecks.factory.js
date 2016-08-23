(function() {

    angular
        .module('crowbarData.upgrade')
        .factory('upgradePrechecksFactory', upgradePrechecksFactory);

    upgradePrechecksFactory.$inject = ['$q', '$http'];
    /* @ngInject */
    function upgradePrechecksFactory($q, $http) {
        var factory = {
            getAll: getPrechecks
        };

        return factory;

        function getPrechecks() {

            var requestOptions = {
                method: 'GET',
                url: '/api/upgrade7/prechecks'
            };

            return $http(requestOptions);
        }
    }
})();
