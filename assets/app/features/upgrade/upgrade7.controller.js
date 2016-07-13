(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name crowbarApp.controller:Upgrade7Ctrl
   * @description
   * # Upgrade7Ctrl
   * This is the controller that will be used across the upgrade process.
   */
  angular.module('crowbarApp')
    .controller('Upgrade7Ctrl', Upgrade7Ctrl);

  Upgrade7Ctrl.$inject = ['$scope', '$translate', '$state', 'stepsFactory', 'prechecksFactory'];
  // @ngInject
  function Upgrade7Ctrl($scope, $translate, $state, stepsFactory, prechecksFactory) {
    var controller = this,
      steps = {
        list: [],
        activeStep: {},
        nextStep: nextStep,
        isLastStep: isLastStep
      };
    controller.steps = steps;

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
    };

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
    };

    /**
     * Validate if the active step is the last avilable step
     * @return boolean
     */
    function isLastStep() {
      return controller.steps.list[steps.list.length - 1] === controller.steps.activeStep;
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
