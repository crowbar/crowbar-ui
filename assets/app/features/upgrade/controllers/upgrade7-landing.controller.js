(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name crowbarApp.controller:Upgrade7LandingController
   * @description
   * # Upgrade7LandingController
   * This is the controller used on the Upgrade landing page
   */
  angular.module('crowbarApp')
    .controller('Upgrade7LandingController', Upgrade7LandingController);

  Upgrade7LandingController.$inject = ['$translate', '$state', 'prechecksFactory'];
  // @ngInject
  function Upgrade7LandingController($translate, $state, prechecksFactory) {
    var vm = this;
    vm.beginUpgrade = beginUpgrade;

    vm.prechecks = {
      completed: false,
      runPrechecks: runPrechecks,
      checks: [
        {
          code: '001',
          status: true
        },
        {
          code: '002',
          status: true
        },
        {
          code: '003',
          status: true
        }
      ],
      valid: false,
      button: 'upgrade'
    };

    /**
     * Move to the next available Step
     */
    function beginUpgrade() {
      // Only move forward if all prechecks has been executed and passed.
      if (!vm.prechecks.completed || !vm.prechecks.valid) {
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
          function() {
          },
          //Failure handler:
          function(errorPrechecksResponse) {
            vm.prechecks.errors = errorPrechecksResponse.data.errors;
          }
        ).finally(
          function() {
            vm.prechecks.completed = true;

            for(var i=0; i<vm.prechecks.checks.length; i++) {
              if (!vm.prechecks.checks[i].status) {
                vm.prechecks.valid = false;
                return;
              } else {
                vm.prechecks.valid = true;
              }
            }
          }
        );

    }
  }
})();
