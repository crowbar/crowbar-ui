(function() {
    'use strict';

    /**
    * @ngdoc function
    * @name crowbarApp.upgrade.controller:UpgradeOpenStackBackupController
    * @description
    * # UpgradeOpenStackBackupController
    * This is the controller used on the OpenStack Backup page
    */
    angular.module('crowbarApp.upgrade')
        .controller('UpgradeOpenStackBackupController', UpgradeOpenStackBackupController);

    UpgradeOpenStackBackupController.$inject = [
        'upgradeFactory',
        'upgradeStepsFactory',
        'upgradeStatusFactory',
        'UPGRADE_STEPS',
        'UNEXPECTED_ERROR_DATA',
        'OPENSTACK_BACKUP_TIMEOUT_INTERVAL',
    ];
    // @ngInject
    function UpgradeOpenStackBackupController(
        upgradeFactory,
        upgradeStepsFactory,
        upgradeStatusFactory,
        UPGRADE_STEPS,
        UNEXPECTED_ERROR_DATA,
        OPENSTACK_BACKUP_TIMEOUT_INTERVAL
    ) {
        var vm = this;

        vm.openStackBackup = {
            completed: false,
            running: false,
            spinnerVisible: false,
            createBackup: createBackup,
        };

        activate();

        function activate() {
            upgradeStatusFactory.syncStatusFlags(
                UPGRADE_STEPS.backup_openstack, vm.openStackBackup,
                waitForBackupToEnd, createBackupSuccess, createBackupError
            );
        }

        /**
         * Trigger creation of OpenStack backup
         */
        function createBackup() {
            vm.openStackBackup.running = true;

            upgradeFactory.createOpenstackBackup()
                .then(
                    waitForBackupToEnd,
                    createBackupError
                );
        }

        /**
         * Start polling for status and wait until backup is created
         */
        function waitForBackupToEnd() {
            upgradeStatusFactory.waitForStepToEnd(
                UPGRADE_STEPS.backup_openstack,
                OPENSTACK_BACKUP_TIMEOUT_INTERVAL,
                createBackupSuccess,
                createBackupError
            );
        }

        function createBackupSuccess(/*response*/) {
            vm.openStackBackup.running = false;
            vm.openStackBackup.completed = true;

            upgradeStepsFactory.setCurrentStepCompleted()
        }

        function createBackupError(errorResponse) {
            vm.openStackBackup.running = false;
            // Expose the error list
            if (angular.isDefined(errorResponse.data.errors)) {
                vm.errors = errorResponse.data;
            } else if (angular.isDefined(errorResponse.data.steps)) {
                vm.errors = { errors: errorResponse.data.steps.backup_openstack.errors };
            } else {
                vm.errors = UNEXPECTED_ERROR_DATA;
            }
        }
    }
})();
