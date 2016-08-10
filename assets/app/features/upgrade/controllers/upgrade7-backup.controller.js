(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name crowbarApp.controller:Upgrade7BackupCtrl
   * @description
   * # Upgrade7BackupCtrl
   * This is the controller used on the Upgrade landing page
   */
  angular.module('crowbarApp')
    .controller('Upgrade7BackupCtrl', Upgrade7BackupCtrl);

  Upgrade7BackupCtrl.$inject = ['$scope', '$translate', '$state'];
  // @ngInject
  function Upgrade7BackupCtrl($scope, $translate, $state) {
    var controller = this;
    controller.beginUpdate = beginUpdate;

    /**
     * Move to the next available Step
     */
    function beginUpdate() {
      // Only move forward if all prechecks has been executed and passed.
      if (!controller.prechecks.completed || controller.prechecks.errors) {
        return;
      }

      $state.go('upgrade7.backup');
    }
  }
})();
