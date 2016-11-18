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
        '$timeout', 'crowbarFactory', 'upgradeStatusFactory',
        'ADMIN_UPGRADE_TIMEOUT_INTERVAL', 'ADMIN_UPGRADE_ALLOWED_DOWNTIME',
        'upgradeFactory', 'upgradeStepsFactory'
    ];
    // @ngInject
    function UpgradeUpgradeAdministrationServerController(
      $timeout,
      crowbarFactory,
      upgradeStatusFactory,
      ADMIN_UPGRADE_TIMEOUT_INTERVAL,
      ADMIN_UPGRADE_ALLOWED_DOWNTIME,
      upgradeFactory,
      upgradeStepsFactory
    ) {
        var vm = this;
        vm.adminUpgrade = {
            completed: false,
            running: false,
            spinnerVisible: false,
            beginAdminUpgrade: beginAdminUpgrade,
        };

        activate();

        function activate() {
            // On page load we need to check to see if the upgrade is already running to set
            // the button status and the update check running
            // TODO(itxaka): Not tested yet, tests should be done as part of card:
            // https://trello.com/c/5fXGm1a7/45-2-27-restore-last-step
            upgradeFactory.getStatus()
                .then(
                    function (response) {
                        vm.adminUpgrade.running = response.data.steps.admin_upgrade.status == 'running';
                        vm.adminUpgrade.completed = response.data.steps.admin_upgrade.status == 'passed';
                        if (vm.adminUpgrade.completed) {
                            upgradeStepsFactory.setCurrentStepCompleted();
                        } else if (vm.adminUpgrade.running) {
                            waitForUpgradeToEnd();
                        }
                    },
                    function (/*errorResponse*/) {
                    }
                );
        }

        function beginAdminUpgrade() {
            vm.adminUpgrade.running = true;

            crowbarFactory.upgrade()
                .then(
                    // In case of success
                    function (/*response*/) {
                        vm.adminUpgrade.running = true;
                        waitForUpgradeToEnd();
                    },
                    // In case of failure
                    function (errorResponse) {
                        vm.adminUpgrade.running = false;
                        // Expose the error list to adminUpgrade object
                        vm.adminUpgrade.errors = errorResponse.data.errors;
                    }
                );
        }

        function waitForUpgradeToEnd() {
            upgradeStatusFactory.waitForStepToEnd(
                'admin_upgrade',
                function (/*response*/) {
                    vm.adminUpgrade.running = false;
                    vm.adminUpgrade.completed = true;
                    upgradeStepsFactory.setCurrentStepCompleted();
                },
                function (errorResponse) {
                    vm.adminUpgrade.running = false;
                    // TODO(itxaka): Use the proper error key from the response when this is done
                    // https://trello.com/c/chzg85j4/142-3-s49p7-error-reporting-on-crowbar-level
                    vm.adminUpgrade.errors = errorResponse.data.errors;
                },
                ADMIN_UPGRADE_TIMEOUT_INTERVAL,
                ADMIN_UPGRADE_ALLOWED_DOWNTIME
            );
        }

    }
})();
