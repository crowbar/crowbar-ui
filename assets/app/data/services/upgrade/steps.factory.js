(function() {

    angular
        .module('crowbarData.upgrade')
        .factory('upgradeStepsFactory', upgradeStepsFactory);

    upgradeStepsFactory.$inject = [];
    /* @ngInject */
    function upgradeStepsFactory() {
        var steps = initialSteps(),
            factory = {
                getAll: getSteps
            };

        return factory;

        function initialSteps() {
            return [
                {
                    id: 0,
                    title: 'Download Backup of Administration Server',
                    state: 'upgrade7.backup',
                    active: false,
                    enabled: false
                },
                {
                    id: 1,
                    title: 'Check Administration Server Repositories',
                    state: 'upgrade7.administration-repository-checks',
                    active: false,
                    enabled: false
                },
                {
                    id: 2,
                    title: 'Upgrade Administration Server',
                    state: 'upgrade7.upgrade-administration-server',
                    active: false,
                    enabled: false
                },
                {
                    id: 3,
                    title: 'Connect or Create OpenStack Database',
                    state: 'upgrade7.database-configuration',
                    active: false,
                    enabled: false
                },
                {
                    id: 4,
                    title: 'Check Add-On & Node Repositories',
                    state: 'upgrade7.nodes-repositories-checks',
                    active: false,
                    enabled: false
                },
                {
                    id: 5,
                    title: 'Migrate OpenStack Database',
                    state: 'upgrade7.openstack-services',
                    active: false,
                    enabled: false
                },
                {
                    id: 6,
                    title: 'Upgrade Nodes & Reapply Barclamps',
                    state: 'upgrade7.finish-upgrade',
                    active: false,
                    enabled: false
                }
            ];
        }

        function getSteps() {
            return steps;
        }
    }
})();
