(function() {
    'use strict';

    /**
     * @ngdoc function
     * @name crowbarApp.controller:Upgrade7Controller
     * @description
     * # Upgrade7Controller
     * This is the controller that will be used across the upgrade process.
     */
    angular.module('crowbarApp.upgrade')
        .controller('Upgrade7Controller', Upgrade7Controller);

    Upgrade7Controller.$inject = ['$scope', '$translate', '$state', 'upgradeStepsFactory'];
    // @ngInject
    function Upgrade7Controller($scope, $translate, $state, upgradeStepsFactory) {
        var vm = this;
        vm.steps = {
            list: [],
            activeStep: {},
            nextStep: nextStep,
            isLastStep: isLastStep
        };

        // Get Steps list from provider
        vm.steps.list = upgradeStepsFactory.getAll();
        refeshStepsList();

        // Watch for view changes on the Step in order to update the steps list.
        $scope.$on('$viewContentLoaded', refeshStepsList);

        /**
         * Refresh the list of steps and active step models
         */
        function refeshStepsList() {
            vm.steps.activeStep = vm.steps.list[0];
            var currentState = $state.current.name,
                isCompletedStep = true;

            for (var i = 0; i < vm.steps.list.length; i++) {
                if (vm.steps.list[i].state === currentState) {
                    vm.steps.activeStep = vm.steps.list[i];
                    vm.steps.activeStep.active = true;
                    vm.steps.activeStep.enabled = isCompletedStep;
                    isCompletedStep = false;

                } else {
                    vm.steps.list[i].active = false;
                    vm.steps.list[i].enabled = isCompletedStep;
                }
            }
        }

        /**
         * Move to the next available Step
         */
        function nextStep() {
            // Only move forward if active step isn't last step available
            if (vm.steps.isLastStep()) {
                return;
            }
            vm.steps.activeStep.active = false;
            vm.steps.activeStep.enabled = true;

            vm.steps.activeStep = vm.steps.list[vm.steps.activeStep.id + 1];
            vm.steps.activeStep.active = true;
            vm.steps.activeStep.enabled = true;

            $state.go(vm.steps.activeStep.state);
        }

        /**
         * Validate if the active step is the last avilable step
         * @return boolean
         */
        function isLastStep() {
            return vm.steps.list[vm.steps.list.length - 1] === vm.steps.activeStep;
        }
    }
})();
