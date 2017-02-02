(function() {
    'use strict';

    /**
    * @ngdoc function
    * @name crowbarApp.upgrade.controller:UpgradeOpenStackServicesController
    * @description
    * # UpgradeOpenStackServicesController
    * This is the controller used on the Stop OpenStack Services page
    */
    angular.module('crowbarApp.upgrade')
        .controller('UpgradeOpenStackServicesController', UpgradeOpenStackServicesController);

    UpgradeOpenStackServicesController.$inject = [
        '$translate',
        'upgradeFactory',
        'upgradeStepsFactory',
        'upgradeStatusFactory',
        'UPGRADE_STEPS',
        'STOP_OPENSTACK_SERVICES_TIMEOUT_INTERVAL',
        'OPENSTACK_BACKUP_TIMEOUT_INTERVAL',
    ];
    // @ngInject
    function UpgradeOpenStackServicesController(
        $translate,
        upgradeFactory,
        upgradeStepsFactory,
        upgradeStatusFactory,
        UPGRADE_STEPS,
        STOP_OPENSTACK_SERVICES_TIMEOUT_INTERVAL,
        OPENSTACK_BACKUP_TIMEOUT_INTERVAL
    ) {
        var vm = this;

        vm.checks = {
            services: {
                status: false,
                completed: false,
                running: false,
                label: 'upgrade.steps.openstack-services.codes.services'
            },
            backup: {
                status: false,
                completed: false,
                running: false,
                label: 'upgrade.steps.openstack-services.codes.backup'
            }
        };

        vm.openStackServices = {
            spinnerVisible: false,
            stopServices: stopServices,
        };

        vm.openStackBackup = {
            createBackup: createBackup,
        };

        activate();

        function activate() {
            // sync backup status before services step sync
            // to know if we need to auto-trigger backup or not.
            upgradeStatusFactory.syncStatusFlags(
                UPGRADE_STEPS.backup_openstack, vm.checks.backup,
                waitForBackupToEnd, createBackupSuccess, createBackupError,
                // postSync function to chain services sync after backup was synced
                function () {
                    upgradeStatusFactory.syncStatusFlags(
                        UPGRADE_STEPS.services, vm.checks.services,
                        waitForStopServicesToEnd, stopServicesSuccess, stopServicesError
                    );
                }
            );

        }

        /**
         *  Stop OpenStack services which are non-essential during upgrade
         */
        function stopServices() {
            // re-starting after failed backup?
            if (vm.checks.services.status) {
                createBackup();
                return;
            }

            vm.checks.services.running = true;

            upgradeFactory.stopServices()
                .then(
                    //Success handler. Stop all OpenStackServices successfully:
                    waitForStopServicesToEnd,
                    //Failure handler:
                    stopServicesError
                );
        }

        function stopServicesSuccess(/*response*/) {
            vm.checks.services.running = false;
            vm.checks.services.status = true;
            vm.checks.services.completed = true;

            // trigger backup creation
            createBackup();
        }

        function stopServicesError(errorResponse) {
            vm.checks.services.running = false;
            vm.checks.services.completed = true
            // Expose the error list to openStackServices object
            vm.errors = errorResponse.data;
        }

        /**
         * Trigger creation of OpenStack backup
         */
        function createBackup() {
            if (vm.checks.backup.status) {
                return;
            }

            vm.checks.backup.completed = false;
            vm.checks.backup.running = true;

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
            vm.checks.backup.running = false;
            vm.checks.backup.status = true;
            vm.checks.backup.completed = true;
            upgradeStepsFactory.setCurrentStepCompleted()
        }

        function createBackupError(errorResponse) {
            vm.checks.backup.running = false;
            vm.checks.backup.status = false;
            vm.checks.backup.completed = true;
            // Expose the error list to openStackBackup object
            vm.errors = errorResponse.data;
        }

        /**
         * Start polling for status and wait until OpenStack services are stopped
         */
        function waitForStopServicesToEnd() {
            upgradeStatusFactory.waitForStepToEnd(
                UPGRADE_STEPS.services,
                STOP_OPENSTACK_SERVICES_TIMEOUT_INTERVAL,
                stopServicesSuccess,
                function (errorResponse) {
                    vm.checks.services.running = false;
                    vm.checks.services.status = false;
                    vm.checks.services.completed = true;
                    vm.errors = errorResponse.data.steps.services;
                }
            );
        }
    }
})();
