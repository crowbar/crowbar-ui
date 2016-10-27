(function() {
    'use strict';

    /**
    * @ngdoc function
    * @name crowbarApp.upgrade.controller:UpgradeUpgradeAdministrationServerController
    * @description
    * # UpgradeUpgradeAdministrationServerController
    * This is the controller used on the Upgrade Admin Server page
    */
    angular.module('crowbarApp.upgrade')
        .controller('UpgradeUpgradeAdministrationServerController', UpgradeUpgradeAdministrationServerController);

    UpgradeUpgradeAdministrationServerController.$inject = [
        '$timeout', 'crowbarFactory', 'ADMIN_UPGRADE_TIMEOUT_INTERVAL', 'upgradeStepsFactory'
    ];
    // @ngInject
    function UpgradeUpgradeAdministrationServerController(
      $timeout,
      crowbarFactory,
      ADMIN_UPGRADE_TIMEOUT_INTERVAL,
      upgradeStepsFactory
    ) {
        var vm = this;
        vm.adminUpgrade = {
            completed: false,
            running: false,
            spinnerVisible: false,
            beginAdminUpgrade: beginAdminUpgrade,
            // note: this is exposed in vm only to simplify testing
            checkAdminUpgrade: checkAdminUpgrade
        };

        activate();

        function activate() {
            // On page load we need to check to see if the upgrade is already running to set
            // the button status and the update check running
            // TODO(itxaka): Not tested yet, tests should be done as part of card:
            // https://trello.com/c/5fXGm1a7/45-2-27-restore-last-step
            checkAdminUpgrade();
        }

        function beginAdminUpgrade() {
            vm.adminUpgrade.running = true;

            crowbarFactory.upgrade()
                .then(
                    // In case of success
                    function (/*response*/) {
                        // start running checkAdminUpgrade at an interval
                        vm.adminUpgrade.checkAdminUpgrade();
                    },
                    // In case of failure
                    function (errorResponse) {
                        vm.adminUpgrade.running = false;
                        // Expose the error list to adminUpgrade object
                        vm.adminUpgrade.errors = errorResponse.data.errors;
                    }
                );
        }

        function checkAdminUpgrade() {
            crowbarFactory.getUpgradeStatus()
                .then(
                    // In case of success
                    function (response) {
                        // map api response to model
                        vm.adminUpgrade.completed = response.data.upgrade.success;
                        vm.adminUpgrade.running = response.data.upgrade.upgrading;
                    },
                    // In case of failure
                    function (errorResponse) {
                        // Expose the error list to adminUpgrade object
                        // TODO(itxaka): Use the proper error key from the response when this is done
                        // https://trello.com/c/chzg85j4/142-3-s49p7-error-reporting-on-crowbar-level
                        vm.adminUpgrade.errors = errorResponse.data.errors;
                    }
                ).finally(
                    function () {
                        // schedule another check if not completed yet
                        if (!vm.adminUpgrade.completed && vm.adminUpgrade.running) {
                            $timeout(vm.adminUpgrade.checkAdminUpgrade, ADMIN_UPGRADE_TIMEOUT_INTERVAL);
                        }
                        // If the upgrade was completed set the step to completed
                        if (vm.adminUpgrade.completed) {
                            upgradeStepsFactory.setCurrentStepCompleted();
                        }
                    }
                );
        }
    }
})();
