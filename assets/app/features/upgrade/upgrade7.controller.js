(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name crowbarApp.controller:Upgrade7Ctrl
   * @description
   * # Upgrade7Ctrl
   * This is the controller that will be used across the upgrade process.
   */
  angular.module('crowbarApp.upgrade')
    .controller('Upgrade7Ctrl', Upgrade7Ctrl);

  Upgrade7Ctrl.$inject = ['$scope', '$translate', '$state', 'upgradeStepsFactory', 'prechecksFactory'];
  // @ngInject
  function Upgrade7Ctrl($scope, $translate, $state, upgradeStepsFactory, prechecksFactory) {
    var controller = this;
    controller.steps = {
        list: [],
        activeStep: {},
        nextStep: nextStep,
        isLastStep: isLastStep
      };

    controller.prechecks = {
      completed: false,
      runPrechecks: runPrechecks
    };

    //@TODO: Remove this once the precheck integration is completed.
    controller.forcePrecheckFailure = true;

    //Run prechecks
    controller.prechecks.runPrechecks(controller.forcePrecheckFailure);

    //@TODO: Remove this once the precheck integration is completed.
    controller.forcePrecheckFailure = false;

    // Get Steps list from provider
    upgradeStepsFactory.getAll().then(
      function(stepsResponse) {
        controller.steps.list = stepsResponse.data;
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
      controller.steps.activeStep = controller.steps.list[0];
      var currentState = $state.current.name,
        isCompletedStep = true;

      for (var i = 0; i < controller.steps.list.length; i++) {
        if (controller.steps.list[i].state === currentState) {
          controller.steps.activeStep = controller.steps.list[i];
          controller.steps.activeStep.active = true;
          controller.steps.activeStep.enabled = isCompletedStep;
          isCompletedStep = false;

        } else {
          controller.steps.list[i].active = false;
          controller.steps.list[i].enabled = isCompletedStep;
        }
      }
    };

    /**
     * Move to the next available Step
     */
    function nextStep() {
      // Only move forward if active step isn't last step available
      if (controller.steps.isLastStep()) {
        return;
      }
      controller.steps.activeStep.active = false;
      controller.steps.activeStep.enabled = true;

      controller.steps.activeStep = controller.steps.list[controller.steps.activeStep.id + 1];
      controller.steps.activeStep.active = true;
      controller.steps.activeStep.enabled = true;

      $state.go(controller.steps.activeStep.state);
    };

    /**
     * Validate if the active step is the last avilable step
     * @return boolean
     */
    function isLastStep() {
      return controller.steps.list[controller.steps.list.length - 1] === controller.steps.activeStep;
    }

    /**
     * Pre validation checks
     */
    function runPrechecks(forceFailure = false) {
      prechecksFactory
        .getAll(forceFailure)
        .then(
          //Success handler. Al precheck passed successfully:
          function(prechecksResponse) {
            delete controller.prechecks.errors;
          },
          //Failure handler:
          function(errorPrechecksResponse) {
            controller.prechecks.errors = errorPrechecksResponse.data.errors;
          }
        ).finally(
          function() {
            controller.prechecks.completed = true;
          }
        );

    };
  }
})();
