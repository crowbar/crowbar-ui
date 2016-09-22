(function() {

    angular
        .module('crowbarData.upgrade')
        .factory('upgradePrechecksFactory', upgradePrechecksFactory);

    upgradePrechecksFactory.$inject = ['$q', '$http', 'COMMON_API_V2_HEADERS'];
    /* @ngInject */
    function upgradePrechecksFactory($q, $http, COMMON_API_V2_HEADERS) {
        var factory = {
            getAll: getPrechecks
        };

        return factory;

        function getPrechecks() {

            var requestOptions = {
                method: 'GET',
                url: '/api/upgrade7/prechecks',
                headers: COMMON_API_V2_HEADERS
            };

            return $http(requestOptions);
        }
    }
})();
