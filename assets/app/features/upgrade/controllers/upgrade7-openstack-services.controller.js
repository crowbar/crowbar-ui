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
            completed: false,
            valid: false,
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
            runOpenStackServices: runOpenStackServices
        };


        /**
         *  Validate OpenStackServices required for Cloud 7 Upgrade
         */
        function runOpenStackServices() {
   
            openStackFactory.stopOpenstackServices()
                .then(
                    //Success handler. Stop all OpenStackServices successfully:
                    stopOpenstackServicesSuccess,
                    //Failure handler:
                    stopOpenstackServicesError
                    
                ).finally(function() {
                    // Either on sucess or failure, the openStackServices has been completed.
                    vm.openStackServices.completed = true;

                    // Update openStackServices validity
                    

                });

            function stopOpenstackServicesSuccess (openStackServicesResponse) {

                vm.openStackServices.checks.services.status = openStackServicesResponse.data.services;
                vm.openStackServices.valid = vm.openStackServices.checks.services.status;
                    
                if (true === vm.openStackServices.checks.services.status) {

                    openStackFactory.createOpenstackBackup()
                        .then(
                            //Success handler. Backup OpenStackServices successfully:
                            createOpenstackBackupSuccess,
                            //Failure handler:
                            createOpenstackBackupError
                        ).finally(function() {
                            vm.openStackServices.completed = true;
                            // Update openStackServices validity
                            vm.openStackServices.valid = vm.openStackServices.checks.backup.status;

                        });
                } 
            }

            function stopOpenstackServicesError (errorOpenStackServicesResponse) {

                // Expose the error list to openStackServices object
                vm.openStackServices.errors = errorOpenStackServicesResponse.data.errors;
            }

            function createOpenstackBackupSuccess (openStackBackupResponse) {
                var ResponseData = openStackBackupResponse.data

                vm.openStackServices.checks.backup.status = ResponseData.backup;
            }

            function createOpenstackBackupError (errorOpenStackServicesResponse) {

                // Expose the error list to openStackServices object
                vm.openStackServices.errors = errorOpenStackServicesResponse.data.errors;
            }
        }
    }
})();
