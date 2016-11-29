(function() {

    angular
        .module('crowbarApp.upgrade')
        .factory('upgradeStepsFactory', upgradeStepsFactory);

    upgradeStepsFactory.$inject = ['$state', 'STEP_STATES', 'UPGRADE_LAST_STATE_KEY'];
    /* @ngInject */
    function upgradeStepsFactory($state, STEP_STATES, UPGRADE_LAST_STATE_KEY) {
        var factory = {
            steps: initialSteps(),
            stepByState: stepByState,
            stepByID: stepByID,
            lastStateForRestore: lastStateForRestore,
            activeStep: {},
            refeshStepsList: refeshStepsList,
            setCurrentStepCompleted: setCurrentStepCompleted,
            isCurrentStepCompleted: isCurrentStepCompleted
        };

        return factory;

        function isCurrentStepCompleted() {
            return factory.activeStep.finished;
        }
        function setCurrentStepCompleted() {
            factory.activeStep.finished = true;
        }

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
                    active: false,
                    finished: false
                },
                {
                    id: 1,
                    title: 'upgrade.steps-key.codes.administration-repositories-checks',
                    state: 'upgrade.administration-repository-checks',
                    active: false,
                    finished: false
                },
                {
                    id: 2,
                    title: 'upgrade.steps-key.codes.upgrade-administration-server',
                    state: 'upgrade.upgrade-administration-server',
                    active: false,
                    finished: false
                },
                {
                    id: 3,
                    title: 'upgrade.steps-key.codes.database-configuration',
                    state: 'upgrade.database-configuration',
                    active: false,
                    finished: false
                },
                {
                    id: 4,
                    title: 'upgrade.steps-key.codes.nodes-repositories-checks',
                    state: 'upgrade.nodes-repositories-checks',
                    active: false,
                    finished: false
                },
                {
                    id: 5,
                    title: 'upgrade.steps-key.codes.openstack-services',
                    state: 'upgrade.openstack-services',
                    active: false,
                    finished: false
                },
                {
                    id: 6,
                    title: 'upgrade.steps-key.codes.upgrade-nodes',
                    state: 'upgrade.upgrade-nodes',
                    active: false,
                    finished: false
                }
            ];
        }

        function stepByState(state) {
            return _.find(factory.steps, function (o) { return o.state === state; });
        }

        function stepByID(id) {
            return _.find(factory.steps, function (o) { return o.id === id; });
        }

        function lastStateForRestore(statusData) {
            var mapping = {
                'upgrade_prechecks': 'upgrade-landing',
                'upgrade_prepare': 'upgrade-landing',
                'admin_backup': 'upgrade.backup',
                'admin_repo_checks': 'upgrade.administration-repository-checks',
                'admin_upgrade': 'upgrade.upgrade-administration-server',
                'database': 'upgrade.database-configuration',
                'nodes_repo_checks': 'upgrade.nodes-repositories-checks',
                'nodes_services': 'upgrade.openstack-services',
                'nodes_db_dump': 'upgrade.openstack-services',
                'nodes_upgrade': 'upgrade.upgrade-nodes',
                'finished': 'TODO(skazi): no UI for this step yet',
            };

            var currentStep = statusData.current_step,
                steps = statusData.steps,
                currentState = mapping[currentStep];

            // select previous step if current is still pending
            if (steps[currentStep].status === STEP_STATES.pending) {
                var storedLastState = localStorage.getItem(UPGRADE_LAST_STATE_KEY);

                // if there is some stored state and it's pointing to page for current pending step
                // show this instead of the previous one, otherwise apply the logic below to find
                // proper page to show
                if (storedLastState === currentState) {
                    return currentState;
                }

                var currentStepData = stepByState(currentState);

                // getting `undefined` from `stepByState()` should happen only
                // for landing page which is not included in the wizard UI.
                if (angular.isDefined(currentStepData)) {
                    if (currentStepData.id > 0) {
                        return stepByID(currentStepData.id - 1).state;
                    } else {
                        // don't move user back from backup page to landing page
                        // this would require another "prepare" call to move forward
                    }
                } else if (currentState === 'upgrade-landing'){
                    // this is the only valid case when expectedStep can be undefined
                    // expectedState is already on landing page so nothing needs to be done
                    // keeping this empty block here to make logic clear
                } else {
                    // TODO(skazi): this should never happen (error)
                }
            }

            return currentState;
        }
    }
})();
