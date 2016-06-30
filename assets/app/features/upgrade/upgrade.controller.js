(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name crowbarApp.controller:UpgradeCtrl
   * @description
   * # UpgradeCtrl
   * Controller of the crowbarApp
   */
  angular.module('crowbarApp')
    .controller('UpgradeCtrl', UpgradeCtrl);

  // @ngInject
  function UpgradeCtrl($scope, $translate, $state) {
    var controller = this,
      steps = {
        nextStep: nextStep,
        isLastStep: isLastStep
      };
    controller.steps = steps;

    // @TODO: move this into a Provider!
    steps.list = [
      {
        id: 0,
        title: 'Prepare Client Node',
        state: 'upgrade.prepare',
        active: true,
        enabled: true
      },
      {
        id: 1,
        title: 'Download Upgrade Data',
        state: 'upgrade.backup',
        active: false,
        enabled: false
      },
      {
        id: 2,
        title: 'Reinstall Admin Server',
        state: 'upgrade.reinstall-admin',
        active: false,
        enabled: false
      },
      {
        id: 3,
        title: 'Continue Upgrade',
        state: 'upgrade.continue-upgrade',
        active: false,
        enabled: false
      },
      {
        id: 4,
        title: 'Restore',
        state: 'upgrade.restore-admin',
        active: false,
        enabled: false
      },
      {
        id: 5,
        title: 'Verify Repositories',
        state: 'upgrade.verify-repos',
        active: false,
        enabled: false
      },
      {
        id: 6,
        title: 'Stop OpenStack Services',
        state: 'upgrade.stop-openstack-services',
        active: false,
        enabled: false
      },
      {
        id: 7,
        title: 'Data Backup',
        state: 'upgrade.openstack-backup',
        active: false,
        enabled: false
      },
      {
        id: 8,
        title: 'Upgrading Nodes OS',
        state: 'upgrade.upgrade-nodes-os',
        active: false,
        enabled: false
      },
      {
        id: 9,
        title: 'Finishing Upgrade',
        state: 'upgrade.finishing-upgrade',
        active: false,
        enabled: false
      }
    ];

    // Watch for view changes on the Step in order to update the steps list.
    $scope.$on('$viewContentLoaded', function(event) {
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
    });

    /**
     * Move to the next available Step
     */
    function nextStep() {
      // Only move forward if active step isn't last step available
      if (steps.isLastStep()) {
        return;
      }
      steps.activeStep.active = false;
      steps.activeStep.enabled = true;

      steps.activeStep = steps.list[steps.activeStep.id + 1];
      steps.activeStep.active = true;
      steps.activeStep.enabled = true;

      $state.go(steps.activeStep.state);
    };

    /**
     * Validate if the active step is the last avilable step
     * @return boolean
     */
    function isLastStep() {
      return steps.list[steps.list.length - 1] === steps.activeStep;
    }
  }
})();
