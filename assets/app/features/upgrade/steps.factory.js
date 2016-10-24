(function() {

    angular
        .module('crowbarApp.upgrade')
        .factory('upgradeStepsFactory', upgradeStepsFactory);

    upgradeStepsFactory.$inject = ['$state'];
    /* @ngInject */
    function upgradeStepsFactory($state) {
        var factory = {
            steps: initialSteps(),
            activeStep: {},
            refeshStepsList: refeshStepsList
        };

        return factory;

        function refeshStepsList() {
            var currentState = $state.current.name;

            for (var i = 0; i < factory.steps.length; i++) {

                 //Update active and enabled properties to true for the current state
                if (factory.steps[i].state === currentState) {
                    // Update factory.activeStep with the active step object
                    factory.activeStep = factory.steps[i];
                    factory.steps[i].active = true;

                } else {
                    // The rest of the steps should not be active
                    factory.steps[i].active = false;
                }
            }
        }

        function initialSteps() {
            return [
                {
                    id: 0,
                    title: 'upgrade.steps-key.codes.backup',
                    state: 'upgrade.backup',
                    active: false
                },
                {
                    id: 1,
                    title: 'upgrade.steps-key.codes.administration-repositories-checks',
                    state: 'upgrade.administration-repository-checks',
                    active: false
                },
                {
                    id: 2,
                    title: 'upgrade.steps-key.codes.upgrade-administration-server',
                    state: 'upgrade.upgrade-administration-server',
                    active: false
                },
                {
                    id: 3,
                    title: 'upgrade.steps-key.codes.database-configuration',
                    state: 'upgrade.database-configuration',
                    active: false
                },
                {
                    id: 4,
                    title: 'upgrade.steps-key.codes.nodes-repositories-checks',
                    state: 'upgrade.nodes-repositories-checks',
                    active: false
                },
                {
                    id: 5,
                    title: 'upgrade.steps-key.codes.openstack-services',
                    state: 'upgrade.openstack-services',
                    active: false
                },
                {
                    id: 6,
                    title: 'upgrade.steps-key.codes.upgrade-nodes',
                    state: 'upgrade.upgrade-nodes',
                    active: false
                }
            ];
        }
    }
})();
