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

    Upgrade7OpenStackServicesController.$inject = ['$translate', 'openStackFactory'];
    // @ngInject
    function Upgrade7OpenStackServicesController($translate, openStackFactory) {
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
            stopOpenStackServices: stopOpenStackServices
        };

        /**
         *  Validate OpenStackServices required for Cloud 7 Upgrade
         */
        function stopOpenStackServices() {

            vm.openStackServices.running = true;

            openStackFactory.stopOpenstackServices()
                .then(
                    //Success handler. Stop all OpenStackServices successfully:
                    stopOpenstackServicesSuccess,
                    //Failure handler:
                    stopOpenstackServicesError    
                );

            function stopOpenstackServicesSuccess (openStackServicesResponse) {
                vm.openStackServices.checks.services.status =
                    vm.openStackServices.valid = 
                    openStackServicesResponse.data.services;

                if (vm.openStackServices.checks.services.status) {

                    openStackFactory.createOpenstackBackup()
                        .then(
                            //Success handler. Backup OpenStackServices successfully:
                            createOpenstackBackupSuccess,
                            //Failure handler:
                            createOpenstackBackupError
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

            function stopOpenstackServicesError (errorOpenStackServicesResponse) {
                vm.openStackServices.completed = true;
                vm.openStackServices.running = false;
                // Expose the error list to openStackServices object
                vm.openStackServices.errors = errorOpenStackServicesResponse.data.errors;
            }

            function createOpenstackBackupSuccess (openStackBackupResponse) {
                
                vm.openStackServices.checks.backup.status = openStackBackupResponse.data.backup;
            }

            function createOpenstackBackupError (errorOpenStackServicesResponse) {

                // Expose the error list to openStackServices object
                vm.openStackServices.errors = errorOpenStackServicesResponse.data.errors;
            }
        }
    }
})();
