(function() {

    angular
        .module('suseData.crowbar')
        .factory('upgradeFactory', upgradeFactory);

    upgradeFactory.$inject = ['$q', '$http', '$filter', 'COMMON_API_V2_HEADERS'];
    /* @ngInject */
    function upgradeFactory($q, $http, $filter, COMMON_API_V2_HEADERS) {
        var factory = {
            getPreliminaryChecks: getPreliminaryChecks,
            prepareNodes: prepareNodes,
            getNodesRepoChecks: getNodesRepoChecks,
            getRepositoriesChecks: getRepositoriesChecks,
            getStatus: getStatus,
            getNodesStatus: getNodesStatus,
            createAdminBackup: createAdminBackup,
            createNewDatabaseServer: createNewDatabaseServer,
            connectDatabaseServer: connectDatabaseServer,
            cancelUpgrade: cancelUpgrade,
            stopServices: stopServices,
            createOpenstackBackup: createOpenstackBackup,
            upgradeNodes: upgradeNodes,
            setPostponeComputeNodes: setPostponeComputeNodes,
            setResumeComputeNodes: setResumeComputeNodes,
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
                url: '/api/upgrade/noderepocheck',
                headers: COMMON_API_V2_HEADERS
            };

            return $http(requestOptions);
        }

         /**
         * Get Administration repositories checks (Operative System and Open Stack)
         *
         * @return {Promise}
         */
        function getRepositoriesChecks() {

            var requestOptions = {
                method: 'GET',
                url: '/api/upgrade/adminrepocheck',
                headers: COMMON_API_V2_HEADERS
            };

            return $http(requestOptions);
        }

        /**
        * Install and configure a new database server on the administration server and use it
        * for the migration
        * @return: {Promise}
        */
        function createNewDatabaseServer(data) {
            var requestOptions = {
                method: 'POST',
                url: '/api/upgrade/new',
                headers: COMMON_API_V2_HEADERS,
                data: data
            };

            return $http(requestOptions)
        }

        /**
        * Configure and migrate to an existing database server
        * @return: {Promise}
        */
        function connectDatabaseServer(data) {
            var requestOptions = {
                method: 'POST',
                url: '/api/upgrade/connect',
                headers: COMMON_API_V2_HEADERS,
                data: data
            };

            return $http(requestOptions)
        }

        /**
         * Get the overall upgrade status
         *
         * @return {Promise}
         */
        function getStatus() {

            var requestOptions = {
                method: 'GET',
                url: '/api/upgrade',
                headers: COMMON_API_V2_HEADERS
            };

            return $http(requestOptions);
        }

        /**
         * Get nodes upgrade status
         *
         * @return {Promise}
         */
        function getNodesStatus() {

            var requestOptions = {
                method: 'GET',
                url: '/api/upgrade',
                headers: COMMON_API_V2_HEADERS,
                params: { nodes: true },
            };

            return $http(requestOptions);
        }

        /**
         * Create a new backup of the Administration Node
         *
         * @return {Promise}
         */
        function createAdminBackup() {

            var requestOptions = {
                method: 'POST',
                url: '/api/upgrade/adminbackup',
                data: { backup: { name: 'upgrade-backup-' + $filter('date')(new Date, 'yyyyMMddHHmmss') } },
                headers: COMMON_API_V2_HEADERS
            };

            return $http(requestOptions);
        }

        /**
         * Trigger cancelation of upgrade process.
         *
         * @return {Promise}
         */
        function cancelUpgrade() {

            var requestOptions = {
                method: 'POST',
                url: '/api/upgrade/cancel',
                headers: COMMON_API_V2_HEADERS
            };

            return $http(requestOptions);
        }

         /**
          *  Stop all openstack services
          *
          * @return {Promise}
          */
        function stopServices() {

            var requestOptions = {
                method: 'POST',
                url: '/api/upgrade/services',
                headers: COMMON_API_V2_HEADERS
            };

            return $http(requestOptions);
        }

        /**
         * Create Openstack Database Backup
         *
         * @return {Promise}
         */
        function createOpenstackBackup() {

            var requestOptions = {
                method: 'POST',
                url: '/api/upgrade/openstackbackup',
                headers: COMMON_API_V2_HEADERS
            };

            return $http(requestOptions);
        }

         /**
          * Initiate the upgrade of all nodes
          *
          * @return {Promise}
          */
        function upgradeNodes(upgradeCompute) {

            var requestOptions = {
                method: 'POST',
                url: '/api/upgrade/nodes',
                headers: COMMON_API_V2_HEADERS,
                // triggers upgrade all when upgradeCompute is true, otherwise upgrade controllers only
                data: { component: upgradeCompute ? 'all' : 'controllers' },
            };

            return $http(requestOptions);
        }

        /**
          * Set compute nodes postponed flag
          *
          * @return {Promise}
          */
        function setPostponeComputeNodes() {

            var requestOptions = {
                method: 'POST',
                url: '/api/upgrade/nodes',
                headers: COMMON_API_V2_HEADERS,
                data: { component: 'postpone' },
            };

            return $http(requestOptions);
        }

        /**
          * Unset compute nodes postponed flag
          *
          * @return {Promise}
          */
        function setResumeComputeNodes() {

            var requestOptions = {
                method: 'POST',
                url: '/api/upgrade/nodes',
                headers: COMMON_API_V2_HEADERS,
                data: { component: 'resume' },
            };

            return $http(requestOptions);
        }
    }
})();
