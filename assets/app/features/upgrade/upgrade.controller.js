(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name crowbarApp.upgrade.controller:UpgradeCtrl
   * @description
   * # UpgradeCtrl
   * Controller of the crowbarApp
   */
  angular.module('crowbarApp.upgrade')
    .controller('UpgradeCtrl', UpgradeCtrl);

  UpgradeCtrl.$inject = ['$scope', '$translate', '$state', 'stepsFactory'];
  // @ngInject
  function UpgradeCtrl($scope, $translate, $state, stepsFactory) {
    var controller = this,
      steps = {
        list: [],
        activeStep: {},
        nextStep: nextStep,
        isLastStep: isLastStep
      };
    controller.steps = steps;

    stepsFactory.getAll().then(
      function(stepsResponse) {
        steps.list = stepsResponse.data;
        refeshStepsList();

      },
      function(errorResponse) {
        console.log(errorResponse);

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
      controller.steps.activeStep.active = false;
      controller.steps.activeStep.enabled = true;

      controller.steps.activeStep = controller.steps.list[controller.steps.activeStep.id + 1];
      controller.steps.activeStep.active = true;
      controller.steps.activeStep.enabled = true;

      $state.go(controller.steps.activeStep.state);
    }

    /**
     * Validate if the active step is the last avilable step
     * @return boolean
     */
    function isLastStep() {
      return controller.steps.list[steps.list.length - 1] === controller.steps.activeStep;
    }
  }
})();
