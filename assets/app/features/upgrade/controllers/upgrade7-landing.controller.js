(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name crowbarApp.controller:Upgrade7LandingCtrl
   * @description
   * # Upgrade7LandingCtrl
   * This is the controller used on the Upgrade landing page
   */
  angular.module('crowbarApp')
    .controller('Upgrade7LandingCtrl', Upgrade7LandingCtrl);

  Upgrade7LandingCtrl.$inject = ['$translate', '$state', 'prechecksFactory'];
  // @ngInject
  function Upgrade7LandingCtrl($translate, $state, prechecksFactory) {
    var controller = this;
    controller.beginUpgrade = beginUpgrade;

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

    /**
     * Move to the next available Step
     */
    function beginUpgrade() {
      // Only move forward if all prechecks has been executed and passed.
      if (!controller.prechecks.completed || controller.prechecks.errors) {
        return;
      }

      $state.go('upgrade7.backup');
    }

    /**
     * Pre validation checks
     */
    function runPrechecks(forceFailure) {
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

    }
  }
})();
