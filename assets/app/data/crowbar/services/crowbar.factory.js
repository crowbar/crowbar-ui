(function() {

    angular
        .module('suseData.crowbar')
        .factory('crowbarFactory', crowbarFactory);

    crowbarFactory.$inject = ['$q', '$http', 'COMMON_API_V2_HEADERS'];
    /* @ngInject */
    function crowbarFactory($q, $http, COMMON_API_V2_HEADERS) {
        var factory = {
            getEntity: getEntity,
            upgrade: upgrade,
            getUpgradeStatus: getUpgradeStatus
        };

        return factory;

        /**
         * Get Crowbar Entity
         *
         * @return {Promise}
         */
        function getEntity() {

            var requestOptions = {
                method: 'GET',
                url: '/api/crowbar',
                headers: COMMON_API_V2_HEADERS
            };

            return $http(requestOptions);
        }

        /**
         * Trigger the Upgrade process on the Adinistration Node (Crowbar) from Cloud6 to Cloud7
         *
         * @return {Promise}
         */
        function upgrade() {

            var requestOptions = {
                method: 'POST',
                url: '/api/crowbar/upgrade',
                headers: COMMON_API_V2_HEADERS
            };

            return $http(requestOptions);
        }

        /**
         * Get the upgrade status of the Administration Node (Crowbar)
         *
         * @return {Promise}
         */
        function getUpgradeStatus() {

            var requestOptions = {
                method: 'GET',
                url: '/api/crowbar/upgrade',
                headers: COMMON_API_V2_HEADERS
            };

            return $http(requestOptions);
        }
    }
})();
