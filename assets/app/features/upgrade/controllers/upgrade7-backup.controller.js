(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name crowbarApp.controller:Upgrade7BackupController
   * @description
   * # Upgrade7BackupController
   * This is the controller used on the Upgrade landing page
   */
  angular.module('crowbarApp')
    .controller('Upgrade7BackupController', Upgrade7BackupController);

  Upgrade7BackupController.$inject = ['$translate', '$state', 'backupFactory'];
  // @ngInject
  function Upgrade7BackupController($translate, $state, backupFactory) {
    var vm = this;
    vm.nextStep = nextStep;
    vm.backup = {
      completed: false,
      create: function () {
        backupFactory.create().finally(function () {
          vm.backup.completed = true;
        });
      }
    };

    /**
     * Move to the next available Step
     */
    function nextStep() {
      // Only move forward if the backup has been triggered and offered to download.
      if (!vm.backup.completed) {
        return;
      }

      $state.go('upgrade7.repository-checks');
    }
  }
})();
