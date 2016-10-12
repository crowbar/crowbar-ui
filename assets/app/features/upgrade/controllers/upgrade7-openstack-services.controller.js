(function() {
    'use strict';

    /**
    * @ngdoc function
    * @name crowbarApp.controller:Upgrade7OpenStackServicesController
    * @description
    * # Upgrade7OpenStackServicesController
    * This is the controller used on the Stop OpenStack Services page
    */
    angular.module('crowbarApp')
        .controller('Upgrade7OpenStackServicesController', Upgrade7OpenStackServicesController);

    Upgrade7OpenStackServicesController.$inject = ['$translate', 'openstackFactory'];
    // @ngInject
    function Upgrade7OpenStackServicesController($translate, openstackFactory) {
        var vm = this;
            

        vm.openStackServices = { 
            valid: false,
            completed: false,
            running: false,
            spinnerVisible: false,
            checks: {
                services: {
                    status: false, 
                    label: 'upgrade7.steps.openstack-services.codes.services'
                },
                backup: {
                    status: false, 
                    label: 'upgrade7.steps.openstack-services.codes.backup'
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
                    stopServicesError
                );

            function stopServicesSuccess (openStackServicesResponse) {
                vm.openStackServices.checks.services.status =
                    vm.openStackServices.valid = 
                    openStackServicesResponse.data.services;

                if (vm.openStackServices.checks.services.status) {

                    openstackFactory.createBackup()
                        .then(
                            //Success handler. Backup OpenStackServices successfully:
                            createBackupSuccess,
                            //Failure handler:
                            createBackupError
                        ).finally(function() {
                            vm.openStackServices.completed = true;
                            // Update openStackServices validity
                            vm.openStackServices.running = false;
                            
                            vm.openStackServices.valid = vm.openStackServices.checks.backup.status;
                            
                        });
                } else {
                    vm.openStackServices.completed = true;
                    vm.openStackServices.running = false;
                } 
            }

            function stopServicesError (errorOpenStackServicesResponse) {
                vm.openStackServices.completed = true;
                vm.openStackServices.running = false;
                // Expose the error list to openStackServices object
                vm.openStackServices.errors = errorOpenStackServicesResponse.data.errors;
            }

            function createBackupSuccess (openStackBackupResponse) {
                
                vm.openStackServices.checks.backup.status = openStackBackupResponse.data.backup;
            }

            function createBackupError (errorOpenStackServicesResponse) {

                // Expose the error list to openStackServices object
                vm.openStackServices.errors = errorOpenStackServicesResponse.data.errors;
            }
        }
    }
})();
