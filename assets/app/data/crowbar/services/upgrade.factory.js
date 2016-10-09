(function() {

    angular
        .module('suseData.crowbar')
        .factory('upgradeFactory', upgradeFactory);

    upgradeFactory.$inject = ['$q', '$http', 'COMMON_API_V2_HEADERS'];
    /* @ngInject */
    function upgradeFactory($q, $http, COMMON_API_V2_HEADERS) {
        var factory = {
            getPreliminaryChecks: getPreliminaryChecks,
            prepareNodes: prepareNodes,
            getNodesRepoChecks: getNodesRepoChecks
        };

        return factory;

        /**
         * Get the preliminary checks required to start the upgrade process
         * 
         * @return {Promise}
         */
        function getPreliminaryChecks() {

            var requestOptions = {
                method: 'GET',
                url: '/api/upgrade/prechecks',
                headers: COMMON_API_V2_HEADERS
            };

            return $http(requestOptions);
        }

        /**
         * Prepare nodes for upgrade. This will change the Nodes status to 'upgrade', so no further changes
         * can be applied to them until the upgrade is either completed or canceled.
         * 
         * @return {Promise}
         */
        function prepareNodes() {

            var requestOptions = {
                method: 'POST',
                url: '/api/upgrade/prepare',
                headers: COMMON_API_V2_HEADERS
            };

            return $http(requestOptions);
        }

        /**
         * Get the Repositories checks for the Nodes to be upgraded.
         * (These results doesn't include Administration Server repositories)
         * 
         * @return {Promise}
         */
        function getNodesRepoChecks() {

            var requestOptions = {
                method: 'GET',
                url: '/api/upgrade/repocheck',
                headers: COMMON_API_V2_HEADERS
            };

            return $http(requestOptions);
        }
    }
})();
