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
        'upgradeFactory',
        'upgradeStepsFactory',
        'upgradeStatusFactory',
        'UPGRADE_STEPS',
        'UNEXPECTED_ERROR_DATA',
        'STOP_OPENSTACK_SERVICES_TIMEOUT_INTERVAL',
    ];
    // @ngInject
    function UpgradeOpenStackServicesController(
        upgradeFactory,
        upgradeStepsFactory,
        upgradeStatusFactory,
        UPGRADE_STEPS,
        UNEXPECTED_ERROR_DATA,
        STOP_OPENSTACK_SERVICES_TIMEOUT_INTERVAL
    ) {
        var vm = this;

        vm.openStackServices = {
            completed: false,
            running: false,
            spinnerVisible: false,
            stopServices: stopServices,
            mode: null,
        };

        activate();

        function activate() {
            upgradeStatusFactory.syncStatusFlags(
                UPGRADE_STEPS.services, vm.openStackServices,
                waitForStopServicesToEnd, stopServicesSuccess, stopServicesError,
                updateMode
            );
        }

        /**
         * Update stored upgrade mode from received status response.
         */
        function updateMode(response) {
            if (response.data.selected_upgrade_mode) {
                vm.openStackServices.mode = response.data.selected_upgrade_mode;
            }
        }

        /**
         *  Stop OpenStack services which are non-essential during upgrade
         */
        function stopServices() {
            vm.openStackServices.running = true;

            upgradeFactory.stopServices()
                .then(
                    //Success handler. Stop all OpenStackServices successfully:
                    waitForStopServicesToEnd,
                    //Failure handler:
                    stopServicesError
                );
        }

        function stopServicesSuccess(/*response*/) {
            vm.openStackServices.running = false;
            vm.openStackServices.completed = true;

            upgradeStepsFactory.setCurrentStepCompleted()
        }

        function stopServicesError(errorResponse) {
            vm.openStackServices.running = false;
            // Expose the error list
            if (angular.isDefined(errorResponse.data.errors)) {
                vm.errors = errorResponse.data;
            } else if (angular.isDefined(errorResponse.data.steps)) {
                vm.errors = { errors: errorResponse.data.steps.services.errors };
            } else {
                vm.errors = UNEXPECTED_ERROR_DATA;
            }
        }

        /**
         * Start polling for status and wait until OpenStack services are stopped
         */
        function waitForStopServicesToEnd() {
            upgradeStatusFactory.waitForStepToEnd(
                UPGRADE_STEPS.services,
                STOP_OPENSTACK_SERVICES_TIMEOUT_INTERVAL,
                stopServicesSuccess,
                stopServicesError
            );
        }
    }
})();
