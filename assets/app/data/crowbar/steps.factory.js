(function() {

    angular
        .module('suseData.crowbar')
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
            var currentState = $state.current.name,
                isCompletedStep = true;

            for (var i = 0; i < factory.steps.length; i++) {

                /** 
                Update factory steps.active and steps.enabled to ture, 
                if the steps.state is equal to the current state 
                */
                if (factory.steps[i].state === currentState) {
                    // Update factory.activeStep with the active step object
                    factory.activeStep = factory.steps[i];
                    factory.steps[i].active = true;
                    factory.steps[i].enabled = isCompletedStep;
                    isCompletedStep = false;

                } else {
                    factory.steps[i].active = false;
                    factory.steps[i].enabled = isCompletedStep;
                }
            }
        }

        function initialSteps() {
            return [
                {
                    id: 0,
                    title: 'upgrade.steps-key.codes.backup',
                    state: 'upgrade.backup',
                    active: false,
                    enabled: false
                },
                {
                    id: 1,
                    title: 'upgrade.steps-key.codes.administration-repositories-checks',
                    state: 'upgrade.administration-repository-checks',
                    active: false,
                    enabled: false
                },
                {
                    id: 2,
                    title: 'upgrade.steps-key.codes.upgrade-administration-server',
                    state: 'upgrade.upgrade-administration-server',
                    active: false,
                    enabled: false
                },
                {
                    id: 3,
                    title: 'upgrade.steps-key.codes.database-configuration',
                    state: 'upgrade.database-configuration',
                    active: false,
                    enabled: false
                },
                {
                    id: 4,
                    title: 'upgrade.steps-key.codes.nodes-repositories-checks',
                    state: 'upgrade.nodes-repositories-checks',
                    active: false,
                    enabled: false
                },
                {
                    id: 5,
                    title: 'upgrade.steps-key.codes.openstack-services',
                    state: 'upgrade.openstack-services',
                    active: false,
                    enabled: false
                },
                {
                    id: 6,
                    title: 'upgrade.steps-key.codes.upgrade-nodes',
                    state: 'upgrade.upgrade-nodes',
                    active: false,
                    enabled: false
                }
            ];
        }
    }
})();
