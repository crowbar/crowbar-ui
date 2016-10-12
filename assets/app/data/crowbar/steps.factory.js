(function() {

    angular
        .module('suseData.crowbar')
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
                    state: 'upgrade.backup',
                    active: false,
                    enabled: false
                },
                {
                    id: 1,
                    title: 'Check Administration Server Repositories',
                    state: 'upgrade.administration-repository-checks',
                    active: false,
                    enabled: false
                },
                {
                    id: 2,
                    title: 'Upgrade Administration Server',
                    state: 'upgrade.upgrade-administration-server',
                    active: false,
                    enabled: false
                },
                {
                    id: 3,
                    title: 'Connect or Create OpenStack Database',
                    state: 'upgrade.database-configuration',
                    active: false,
                    enabled: false
                },
                {
                    id: 4,
                    title: 'Check Add-On & Node Repositories',
                    state: 'upgrade.nodes-repositories-checks',
                    active: false,
                    enabled: false
                },
                {
                    id: 5,
                    title: 'Backup OpenStack Database',
                    state: 'upgrade.openstack-services',
                    active: false,
                    enabled: false
                },
                {
                    id: 6,
                    title: 'Upgrade Nodes & Reapply Barclamps',
                    state: 'upgrade.finish-upgrade',
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
