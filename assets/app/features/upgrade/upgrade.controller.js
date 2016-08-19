(function() {
    'use strict';

    /**
     * @ngdoc function
     * @name crowbarApp.upgrade.controller:UpgradeController
     * @description
     * # UpgradeController
     * Controller of the crowbarApp
     */
    angular.module('crowbarApp.upgrade')
        .controller('UpgradeController', UpgradeController);

    UpgradeController.$inject = ['$scope', '$translate', '$state', 'stepsFactory'];
    // @ngInject
    function UpgradeController($scope, $translate, $state, stepsFactory) {
        var vm = this,
            steps = {
                list: [],
                activeStep: {},
                nextStep: nextStep,
                isLastStep: isLastStep
            };
        vm.steps = steps;

        stepsFactory.getAll().then(
            function(stepsResponse) {
                steps.list = stepsResponse.data;
                refeshStepsList();

            },
            function() {
            //console.log(errorResponse);

            }
        );

        // Watch for view changes on the Step in order to update the steps list.
        $scope.$on('$viewContentLoaded', refeshStepsList);

        /**
         * Refresh the list of steps and active step models
         */
        function refeshStepsList() {
            steps.activeStep = steps.list[0];
            var currentState = $state.current.name,
                isCompletedStep = true;

            for (var i = 0; i < steps.list.length; i++) {
                if (steps.list[i].state === currentState) {
                    steps.activeStep = steps.list[i];
                    steps.activeStep.active = true;
                    steps.activeStep.enabled = isCompletedStep;
                    isCompletedStep = false;

                } else {
                    steps.list[i].active = false;
                    steps.list[i].enabled = isCompletedStep;
                }
            }
        }

        /**
         * Move to the next available Step
         */
        function nextStep() {
            // Only move forward if active step isn't last step available
            if (steps.isLastStep()) {
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
            return vm.steps.list[steps.list.length - 1] === vm.steps.activeStep;
        }
    }
})();
