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

    UpgradeOpenStackServicesController.$inject = ['$translate', 'openstackFactory', 'upgradeStepsFactory'];
    // @ngInject
    function UpgradeOpenStackServicesController($translate, openstackFactory, upgradeStepsFactory) {
        var vm = this;

        vm.openStackServices = {
            valid: false,
            completed: false,
            running: false,
            spinnerVisible: false,
            checks: {
                services: {
                    status: false,
                    label: 'upgrade.steps.openstack-services.codes.services'
                },
                backup: {
                    status: false,
                    label: 'upgrade.steps.openstack-services.codes.backup'
                }
            },
            stopServices: stopServices
        };

        /**
         *  Validate OpenStackServices required for Cloud 7 Upgrade
         */
        function stopServices() {
            vm.openStackServices.running = true;

            openstackFactory.stopServices()
                .then(
                    //Success handler. Stop all OpenStackServices successfully:
                    stopServicesSuccess,
                    //Failure handler:
                    onAnyError
                );

            function stopServicesSuccess () {
                vm.openStackServices.checks.services.status = true;

                openstackFactory.createBackup()
                    .then(
                        //Success handler. Backup OpenStackServices successfully:
                        createBackupSuccess,
                        //Failure handler:
                        onAnyError
                    ).finally(function() {
                        vm.openStackServices.completed = true;
                        vm.openStackServices.running = false;
                        // if the backup has finished set the step to complete
                        if (vm.openStackServices.valid) {
                            upgradeStepsFactory.setCurrentStepCompleted()
                        }
                    });
            }

            function onAnyError () {
                vm.openStackServices.completed = true;
                vm.openStackServices.running = false;
                // Failsafe, it should always stay false until the last success
                vm.openStackServices.valid = false;
            }

            function createBackupSuccess () {
                vm.openStackServices.checks.backup.status = true;
                vm.openStackServices.valid = true;
            }

        }
    }
})();
