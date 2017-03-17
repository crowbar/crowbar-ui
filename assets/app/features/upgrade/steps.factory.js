(function() {

    angular
        .module('crowbarApp.upgrade')
        .factory('upgradeStepsFactory', upgradeStepsFactory);

    upgradeStepsFactory.$inject = ['$state', 'upgradeFactory', 'UPGRADE_STEP_STATES', 'UPGRADE_LAST_STATE_KEY'];
    /* @ngInject */
    function upgradeStepsFactory($state, upgradeFactory, UPGRADE_STEP_STATES, UPGRADE_LAST_STATE_KEY) {
        var factory = {
            steps: initialSteps(),
            stepByState: stepByState,
            stepByID: stepByID,
            validateRequestedState: validateRequestedState,
            lastStateForRestore: lastStateForRestore,
            showNextStep: showNextStep,
            isLastStep: isLastStep,
            activeStep: {},
            refeshStepsList: refeshStepsList,
            setCurrentStepCompleted: setCurrentStepCompleted,
            isCurrentStepCompleted: isCurrentStepCompleted,
            isCancelAllowed: isCancelAllowed,
            setCancelAllowed: setCancelAllowed,
            reset: reset,
        };

        return factory;

        function isCurrentStepCompleted() {
            return factory.activeStep.finished;
        }
        function setCurrentStepCompleted() {
            factory.activeStep.finished = true;
        }

        function isCancelAllowed() {
            return factory.activeStep.cancelAllowed;
        }
        function setCancelAllowed(value) {
            factory.activeStep.cancelAllowed = value;
        }

        function reset() {
            factory.steps = initialSteps();
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
                    cancelAllowed: true,
                    finished: false
                },
                {
                    id: 1,
                    title: 'upgrade.steps-key.codes.administration-repositories-checks',
                    state: 'upgrade.administration-repository-checks',
                    active: false,
                    cancelAllowed: true,
                    finished: false
                },
                {
                    id: 2,
                    title: 'upgrade.steps-key.codes.upgrade-administration-server',
                    state: 'upgrade.upgrade-administration-server',
                    active: false,
                    cancelAllowed: true,
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
                    title: 'upgrade.steps-key.codes.openstack-backup',
                    state: 'upgrade.openstack-backup',
                    active: false,
                    finished: false
                },
                {
                    id: 7,
                    title: 'upgrade.steps-key.codes.upgrade-nodes',
                    state: 'upgrade.upgrade-nodes',
                    active: false,
                    finished: false
                }
            ];
        }

        /**
         * Validate if the active step is the last avilable step
         * @return {Boolean}
         */
        function isLastStep() {
            return factory.steps[factory.steps.length - 1] === factory.activeStep;
        }

        /**
         * Move to the next available step
         */
        function showNextStep() {
            // Only move forward if active step isn't last step available
            if (factory.isLastStep()) {
                return;
            }

            var nextState = factory.steps[factory.activeStep.id + 1].state;
            // save new state in local storage for proper "restore last step" handling
            localStorage.setItem(UPGRADE_LAST_STATE_KEY, nextState);

            $state.go(nextState);
        }

        /**
         * Return step data for given state
         * @return {string}
         */
        function stepByState(state) {
            return _.find(factory.steps, function (step) { return step.state === state; });
        }

        /**
         * Return step data for given id
         * @return {string}
         */
        function stepByID(id) {
            return _.find(factory.steps, function (step) { return step.id === id; });
        }

        /**
         * Handler for ui-router state change events to ensure requested page matches current backend status
         * For parameter descriptions see: https://github.com/angular-ui/ui-router/wiki#state-change-events
         */
        function validateRequestedState(event, toState/*, toParams, fromState, fromParams*/) {
            upgradeFactory.getStatus()
                .then(
                    function (response) {
                        var expectedState = factory.lastStateForRestore(response.data);

                        if (toState.name !== expectedState) {
                            event.preventDefault();
                            $state.go(expectedState)
                                .then(function () { factory.refeshStepsList(); });
                        }
                    },
                    function (/*errorResponse*/) {
                    }
                );
        }

        /**
         * For given `map`, return keys mapping to `wantedValue`
         * @return {Array} List of keys filtered by value
         */
        function keysForValue(map, wantedValue) {
            var keys = [];
            _.each(map, function (value, key) {
                if (value === wantedValue) {
                    keys.push(key);
                }
            });
            return keys;
        }

        /**
         * Return ui-router state appropriate for current backend status
         * @param {Object} Status data received from status API
         * @return {string}
         */
        function lastStateForRestore(statusData) {
            var stepToStateMap = {
                    'prechecks': 'upgrade-landing',
                    'prepare': 'upgrade-landing',
                    'backup_crowbar': 'upgrade.backup',
                    'repocheck_crowbar': 'upgrade.administration-repository-checks',
                    'admin': 'upgrade.upgrade-administration-server',
                    'database': 'upgrade.database-configuration',
                    'repocheck_nodes': 'upgrade.nodes-repositories-checks',
                    'services': 'upgrade.openstack-services',
                    'backup_openstack': 'upgrade.openstack-backup',
                    'nodes': 'upgrade.upgrade-nodes',
                },
                currentStep = statusData.current_step,
                steps = statusData.steps,
                currentState = stepToStateMap[currentStep];

            // select previous step if current is still pending and previous step has a different page
            if (steps[currentStep].status === UPGRADE_STEP_STATES.pending) {
                var storedLastState = localStorage.getItem(UPGRADE_LAST_STATE_KEY);

                // if there is some stored state and it's pointing to page for current pending step
                // show this instead of the previous one, otherwise apply the logic below to find
                // proper page to show
                if (storedLastState === currentState) {
                    return currentState;
                }

                var backendStepsWithCurrentState = keysForValue(stepToStateMap, currentState);
                // if there are more "backend" steps matching currentState, only move back if currentStep
                // is the first one on the list
                if (backendStepsWithCurrentState.length > 1 && backendStepsWithCurrentState[0] !== currentStep) {
                    return currentState;
                }

                var currentStepData = stepByState(currentState);

                // getting `undefined` from `stepByState()` should happen only
                // for landing page which is not included in the wizard UI.
                if (angular.isDefined(currentStepData)) {
                    if (currentStepData.id > 0) {
                        return stepByID(currentStepData.id - 1).state;
                    } /* else {
                        // don't move user back from backup page to landing page
                        // this would require another "prepare" call to move forward
                    }*/
                } /* else if (currentState === 'upgrade-landing'){
                    // this is the only valid case when expectedStep can be undefined
                    // expectedState is already on landing page so nothing needs to be done
                    // keeping this empty block here to make logic clear
                }*/
            }

            return currentState;
        }
    }
})();
