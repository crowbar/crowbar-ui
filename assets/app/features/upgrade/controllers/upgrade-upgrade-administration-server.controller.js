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
        'UPGRADE_STEPS', 'UPGRADE_STEP_STATES', 'UNEXPECTED_ERROR_DATA', 'upgradeStepsFactory'
    ];
    // @ngInject
    function UpgradeUpgradeAdministrationServerController(
      $timeout,
      crowbarFactory,
      upgradeStatusFactory,
      ADMIN_UPGRADE_TIMEOUT_INTERVAL,
      ADMIN_UPGRADE_ALLOWED_DOWNTIME,
      UPGRADE_STEPS,
      UPGRADE_STEP_STATES,
      UNEXPECTED_ERROR_DATA,
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
            upgradeStatusFactory.syncStatusFlags(
                UPGRADE_STEPS.admin,
                vm.adminUpgrade,
                waitForUpgradeToEnd,
                function (/*response*/) {
                    // don't enable "Next" if another step is already active
                    if (upgradeStepsFactory.activeStep.state === 'upgrade.upgrade-administration-server') {
                        upgradeStepsFactory.setCurrentStepCompleted();
                    }
                },
                null,
                function (/*response*/) {
                    if (vm.adminUpgrade.completed || vm.adminUpgrade.running) {
                        upgradeStepsFactory.setCancelAllowed(false);
                    }
                }
            );
        }

        function beginAdminUpgrade() {
            vm.adminUpgrade.running = true;
            upgradeStepsFactory.setCancelAllowed(false);

            crowbarFactory.upgrade()
                .then(
                    // In case of success
                    function (/*response*/) {
                        waitForUpgradeToEnd();
                    },
                    // In case of failure
                    function (errorResponse) {
                        vm.adminUpgrade.running = false;

                        if (angular.isDefined(errorResponse.data.errors)) {
                            vm.errors = errorResponse.data;
                        } else {
                            vm.errors = UNEXPECTED_ERROR_DATA;
                        }
                    }
                );
        }

        function waitForUpgradeToEnd() {
            upgradeStatusFactory.waitForStepToEnd(
                UPGRADE_STEPS.admin,
                ADMIN_UPGRADE_TIMEOUT_INTERVAL,
                function (/*response*/) {
                    vm.adminUpgrade.running = false;
                    vm.adminUpgrade.completed = true;
                    upgradeStepsFactory.setCurrentStepCompleted();
                },
                function (errorResponse) {
                    vm.adminUpgrade.running = false;

                    if (angular.isDefined(errorResponse.data.errors)) {
                        vm.errors = errorResponse.data;
                    } else if (angular.isDefined(errorResponse.data.steps)) {
                        vm.errors = { errors: errorResponse.data.steps.admin.errors };
                    } else {
                        vm.errors = UNEXPECTED_ERROR_DATA;
                    }
                },
                null,
                ADMIN_UPGRADE_ALLOWED_DOWNTIME
            );
        }

    }
})();
